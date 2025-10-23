# Panel Material Calculator

This directory contains a self-contained, static web application for estimating the panel and stud (regel) materials needed for a wall.

## Try it locally

You have two simple options:

1. **Open the page directly**
   - Navigate to [`docs/panel_calculator/index.html`](./index.html) in your file browser.
   - Open the file in any modern web browser.

2. **Serve it with a local web server**
   - From the repository root, run:
     ```bash
     cd docs
     make panel-calculator
     ```
   - This starts a simple HTTP server at <http://127.0.0.1:8000/panel_calculator/>. Press `Ctrl+C` to stop the server when you're done.

> The calculator runs entirely in your browser; no backend services are required.
