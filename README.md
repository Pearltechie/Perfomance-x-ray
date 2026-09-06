# Performance Autopilot: Chrome DevTools Engine

A specialized browser system utility built natively on Manifest V3. This extension operates inside Chrome DevTools to audit live DOM layout allocations, trace thread rendering bottlenecks, and inject hardware-accelerated memory patches on running production pages.

## Core Architectural Modules

### 1. Telemetry Tracking Pipeline
Uses high-resolution microsecond counters (`performance.now()`) to track layout performance. It intercepts individual node rendering states and profiles live CPU execution costs on the main main-thread.

### 2. Paint Vector Verification
To prevent false metrics, the engine validates layout thrashes by measuring structural bounding matrices via `getBoundingClientRect()` inside a simulated coordinate cycle before flagging a bottleneck.

### 3. Dynamic Memory Hot-Patching
Allows developers to isolate specific selectors and execute an immediate runtime patch via `chrome.devtools.inspectedWindow.eval`, shifting rendering tasks to the GPU composite layer using hardware-accelerated vectors without updating source files.

## Technical Stack & Mechanics
* **Manifest Version:** V3 Architecture
* **Interface Design:** Dark-mode minimalist slate profile utilizing high-contrast accents for telemetry scanning states.
* **APIs Implemented:** Chrome DevTools Panel Engine, Performance Timeline, Document Object Model Traversal Trees.
