# Performance Autopilot: Chrome DevTools Engine

A specialized browser system utility built natively on Manifest V3. This extension operates inside Chrome DevTools to audit live DOM layout allocations, trace thread rendering bottlenecks, and inject hardware-accelerated memory patches on running production pages.

## Core Architectural Modules

### 1. Telemetry Tracking Pipeline
Uses high-resolution microsecond counters (performance.now()) to track layout performance. It intercepts individual node rendering states and profiles live CPU execution costs on the main thread.

### 2. Paint Vector Verification
To prevent false metrics, the engine validates layout thrashes by measuring structural bounding matrices via getBoundingClientRect() inside a simulated coordinate cycle before flagging a bottleneck.

### 3. Dynamic Memory Hot-Patching
Allows developers to isolate specific selectors and execute an immediate runtime patch via chrome.devtools.inspectedWindow.eval, shifting rendering tasks to the GPU composite layer using hardware-accelerated vectors without updating source files.

## Technical Stack & Mechanics
* **Manifest Version:** V3 Architecture
* **Interface Design:** Dark-mode minimalist slate profile utilizing high-contrast accents for telemetry scanning states.
* **APIs Implemented:** Chrome DevTools Panel Engine, Performance Timeline, Document Object Model Traversal Trees.

## Installation & Local Setup

To load and run this development utility locally inside your browser, follow these three steps:

1. **Clone the Codebase:**
   Clone this repository to your local machine and unzip the directory:
   ```bash
   git clone https://github.com/Pearltechie/Perfomance-x-ray
   ```

2. **Load the Extension into Chrome:**
   * Open Google Chrome and navigate to `chrome://extensions/` in the URL address bar.
   * Look at the top right-hand corner and toggle **Developer mode** to **ON**.
   * Look at the top left-hand corner and click the **Load unpacked** button.
   * Select the unzipped project directory folder containing your `manifest.json` file.

3. **Execute the Diagnostic Engine:**
   * Open any live production website (e.g., GitHub, LinkedIn, or YouTube).
   * Open the browser Developer Tools panel by pressing `F12` (or right-clicking and selecting **Inspect**).
   * Look at the top navigation tab bar inside DevTools and click on your custom tab: **Performance X-Ray**.
   * Click the **Execute Page Audit** button to begin tracing live thread latency and testing runtime memory hot-patching.
