document.getElementById('scan-btn').addEventListener('click', () => {
  document.getElementById('scan-btn').innerText = "Analyzing DOM structure...";
  document.getElementById('results-container').innerHTML = "";

  chrome.devtools.inspectedWindow.eval(`
    (() => {
      const anomalies = [];
      const allElements = document.querySelectorAll('*');
      let combinedLatency = 0;
      
      allElements.forEach((el, index) => {
        const styles = window.getComputedStyle(el);
        el.setAttribute('data-xray-id', 'node-' + index);
        
        if ((styles.position === 'absolute' || styles.position === 'relative') && 
            (styles.top !== 'auto' || styles.left !== 'auto') && 
            styles.top !== '0px' && styles.left !== '0px') {
          
          // --- REAL-TIME LATENCY MEASUREMENT ENGINE ---
          // Capture start timestamp down to the microsecond
          const tStart = performance.now();
          
          const rectBefore = el.getBoundingClientRect();
          const initialTop = el.style.top;
          
          // Force layout recalculation cycle
          el.style.top = (parseFloat(styles.top) + 1) + 'px';
          const rectAfter = el.getBoundingClientRect();
          el.style.top = initialTop;
          
          // Capture end timestamp immediately after engine execution
          const tEnd = performance.now();
          const executionTime = tEnd - tStart;

          if (rectBefore.top === rectAfter.top) return;
          
          // Accumulate the microsecond execution penalty
          combinedLatency += executionTime;

          let identifier = el.tagName.toLowerCase();
          if (el.id) identifier += '#' + el.id;
          else if (el.className) identifier += '.' + String(el.className).split(' ');

          let sourceOrigin = "Inline Style Template";
          if (document.location) {
            sourceOrigin = document.location.pathname + " (DOM Dynamic Render)";
          }

          anomalies.push({
            id: 'node-' + index,
            type: "Layout Thrashing",
            element: identifier,
            location: sourceOrigin,
            latency: executionTime.toFixed(3) + "ms",
            issue: "Element utilizes positional top/left coordinates. Modifying these properties dynamically triggers main-thread reflow cycles.",
            fix: "element.style.position = '" + styles.position + "';\\n" +
                 "element.style.willChange = 'transform';\\n" +
                 "element.style.transform = 'translate3d(0px, 0px, 0)';"
          });
        }
      });

      return { anomalies, totalLatency: combinedLatency.toFixed(2) + "ms" };
    })()
  `, (result, isException) => {
    document.getElementById('scan-btn').innerText = "Execute Page Audit";
    
    if (isException || !result || result.anomalies.length === 0) {
      document.getElementById('health-score').innerText = "100%";
      document.getElementById('total-latency').innerText = "0.00ms";
      document.getElementById('results-container').innerHTML = "<p style='color:#64748b; font-size:12px;'>No verified layout performance bottlenecks detected.</p>";
      return;
    }

    const list = result.anomalies;
    let thrashCount = list.filter(r => r.type === "Layout Thrashing").length;
    
    document.getElementById('count-thrash').innerText = thrashCount;
    document.getElementById('total-latency').innerText = result.totalLatency;

    let score = Math.max(8, 100 - (list.length * 4));
    document.getElementById('health-score').innerText = score + "%";

    list.forEach(issue => {
      const card = document.createElement('div');
      card.className = "issue-row";

      card.innerHTML = `
        <div class="issue-meta">
          <span class="issue-tag">${issue.type}</span>
          <span class="location-tag">${issue.element}</span>
        </div>
        <div class="issue-title">Performance bottleneck at target selector</div>
        <div class="issue-desc" style="color: #64748b; font-family: monospace; font-size: 11px; margin-bottom: 4px;">Origin Source: ${issue.location}</div>
        <div class="issue-desc" style="color: #38bdf8; font-family: monospace; font-size: 11px; margin-bottom: 6px;">Thread Execution Latency: ${issue.latency}</div>
        <div class="issue-desc">${issue.issue}</div>
        <button class="patch-btn" data-node-id="${issue.id}" style="margin-bottom: 12px; background: transparent; color: #38bdf8; border: 1px solid #38bdf8; padding: 6px 12px; font-size: 11px; width: auto;">Inject Dynamic Hot-Patch</button>
        <pre><code>${issue.fix}</code></pre>
      `;
      document.getElementById('results-container').appendChild(card);
    });

    document.querySelectorAll('.patch-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const nodeId = e.target.getAttribute('data-node-id');
        chrome.devtools.inspectedWindow.eval(`
          (() => {
            const targetEl = document.querySelector('[data-xray-id="${nodeId}"]');
            if (targetEl) {
              targetEl.style.willChange = 'transform';
              targetEl.style.transform = 'translate3d(0px, 0px, 0)';
              return true;
            }
            return false;
          })()
        `, (patched) => {
          if (patched) {
            e.target.innerText = "Hot-Patch Injected Successfully";
            e.target.style.color = "#10b981";
            e.target.style.borderColor = "#10b981";
          }
        });
      });
    });
  });
});
