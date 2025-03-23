Hacking PDF.js
==============

Source Code: `PDF.js@github <https://github.com/mozilla/pdf.js>`_

How the pan events are handled
------------------------------

A Hack into web/viewer.js.

Why? Since the question, `Just need zoom and pan with viewer #17670 <https://github.com/mozilla/pdf.js/discussions/17670>`_
is not answered (23 Mar, 2025).

The Pan events handling can be found in the web/viewer.js example. 

This should run the example, web/viewer.html::

    npm i

Then start a web server in the project root folder.

.. image:: imgs/22-pdfjs-web-viewer.png
    :height: 12em

* Insight

In web/viewer.html:

.. code-block:: html

    <head>
    <script type="importmap">
      {
        "imports": {
          "pdfjs/": "../src/",
          "pdfjs-lib": "../src/pdf.js",

          "web-pdf_cursor_tools": "./pdf_cursor_tools.js",
          ...
        }
      }
    </script>
    <script src="viewer.js" type="module"></script>
    </head>

    <body tabindex="0">
        <div id="outerContainer">
            <div id="toolbarContainer">...</div>
 
            <div id="mainContainer">
                <div id="viewerContainer" tabindex="0">
                    <div id="viewer" class="pdfViewer"></div>
                </div>
            </div>

            <div id="dialogContainer">...</div>
        </div>
    </body>

The app implementation, PDFViewerApplication from app.js, is managed in viewer.js:

.. code-block:: javascript

    function getViewerConfiguration() {
        return {
            appContainer: document.body, 
            principalContainer: document.getElementById("mainContainer"),

            // The container that GrabToPan transformmed.
            mainContainer: document.getElementById("viewerContainer"),

            viewerContainer: document.getElementById("viewer"),
            ...
        };
    }

    function webViewerLoad() {
        const config = getViewerConfiguration();
        // ...
        PDFViewerApplication.run(config);
    }

    document.addEventListener("DOMContentLoaded", webViewerLoad, true);

app.js:

.. code-block:: javascript

    const PDFViewerApplication = {
        // ...

        async run(config) {
            await this.initialize(config); // bind events, load worker ...
            // ...
        }

        // Called once when the document is loaded.
        async initialize(appConfig) {
            this.appConfig = appConfig;
            await this._initializeViewerComponents();
            //...
        }

        async _initializeViewerComponents() {
            const { appConfig, externalServices, l10n, mlManager } = this;
            const container = appConfig.mainContainer, ...

            // ...

            // NOTE: The cursor-tools are unlikely to be helpful/useful in GeckoView,
            // in particular the `HandTool` which basically simulates touch scrolling.
            if (appConfig.secondaryToolbar?.cursorHandToolButton) {
                this.pdfCursorTools = new PDFCursorTools({
                    container,
                    eventBus,
                    cursorToolOnLoad: AppOptions.get("cursorToolOnLoad"),
                });
            }
        }
    }

pdf_cursor_tools.js:

.. code-block:: javascript

    class PDFCursorTools {
        /**
         * Called by switch toole event handling, 
         *
         * disableActiveTool();
         * this._handTool.activate();
         * @private
         */
        get _handTool() {
            return shadow(
                this,
                "_handTool",
                new GrabToPan({ element: this.container });
            );
        }
    }

Pen events are handled in GrabToPan, where the moving target is the element
parameter in constructor:

.. code-block:: javascript

    class GrabToPan {

        mouseDownAC = null;

        scrollAC = null;

        constructor({ element }) {
            this.element = element;
            this.document = element.ownerDocument;

            // This overlay will be inserted in the document when the mouse moves during
            // a grab operation, to ensure that the cursor has the desired appearance.
            const overlay = (this.overlay = document.createElement("div"));
            overlay.className = "grab-to-pan-grabbing";
        }

        onMouseDown(event) {
            this.scrollLeftStart = this.element.scrollLeft;
            this.scrollTopStart = this.element.scrollTop;
            this.clientXStart = event.clientX;
            this.clientYStart = event.clientY;

            this.mouseDownAC = new AbortController();
            const boundEndPan = this.endPan.bind(this),
            mouseOpts = { capture: true, signal: this.mouseDownAC.signal };

            this.document.addEventListener(
                "mousemove",
                this.onMouseMove.bind(this),
                mouseOpts
            );

            this.document.addEventListener("mouseup", boundEndPan, mouseOpts);
            // When a scroll event occurs before a mousemove, assume that the user
            // dragged a scrollbar (necessary for Opera Presto, Safari and IE)
            // (not needed for Chrome/Firefox)
            this.scrollAC = new AbortController();

            this.element.addEventListener("scroll", boundEndPan, {
                capture: true,
                signal: this.scrollAC.signal,
            });
            stopEvent(event);

            const focusedElement = document.activeElement;
            if (focusedElement && !focusedElement.contains(event.target)) {
                focusedElement.blur();
            }
        }

        onMouseMove(event) {
            this.scrollAC?.abort();
            this.scrollAC = null;

            if (!(event.buttons & 1)) {
                // The left mouse button is released.
                this.endPan();
                return;
            }
            const xDiff = event.clientX - this.clientXStart;
            const yDiff = event.clientY - this.clientYStart;
            this.element.scrollTo({
                top: this.scrollTopStart - yDiff,
                left: this.scrollLeftStart - xDiff,
                behavior: "instant",
            });

            if (!this.overlay.parentNode) {
                document.body.append(this.overlay);
            }
        }

        endPan() {
            this.mouseDownAC?.abort();
            this.mouseDownAC = null;
            this.scrollAC?.abort();
            this.scrollAC = null;
            // Note: ChildNode.remove doesn't throw if the parentNode is undefined.
            this.overlay.remove();
        }
    }
