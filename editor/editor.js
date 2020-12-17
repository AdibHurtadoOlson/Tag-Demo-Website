var i;
var count = 0;
const delayInMilliseconds = 1000;
const totalExamples = 4;
// multiple different examples in html and css
var htmlExamples = ["<!DOCTYPE html>\n<html lang='en'>\n<head>\n<body>\n</body>\n</html>",
    "<!DOCTYPE html>\n<html lang='en'>\n<head>\n    <title>This is a title!</title>\n</head>\n<body>\n</body>\n</html>",
    "<!DOCTYPE html>\n<html lang='en'>\n<head>\n    <title>This is a title!</title>\n</head>\n<body>\n    <h1>This is an interesting heading!</h1>\n</body>\n</html>",
    "<!DOCTYPE html>\n<html lang='en'>\n<head>\n    <title>This is a title!</title>\n</head>\n<body>\n    <h1>This is an interesting heading!</h1>\n    <p>A simple paragraph.</p>\n</body>\n</html>"];
var cssExamples = ["",
    "",
    "h1 {\n    color: white;\n}\n",
    "h1 {\n    color: white;\n}\np {\n    color:teal;\n    background-color: silver;\n}"];
// different descriptions for each example
var descriptions = ["The following examples showcase different tags that are can be used when creating an HTML webpage. This example uses the generic layout that almost every website has. There is an html opening tag followed by a head tag, then the body tag, and finally the html closing tag. Note that nothing is currently being output to our mini webpage on the right. This is because we haven&#39;t added anything into either the head or body tag. ",
    "This next example finally does something! We add a title tag which, you guessed it, adds a title to our webpage. That means whenever you&#39;re looking through the Chrome tabs at the top of your screen, it will say &#39;This is a title!&#39;. We&#39;ve left everything else the same for now but click to the next example to see other demos. ",
    "Now that we&#39;ve added a title to our website, we should add a header. This is the first text that is actually written to our webpage. Let&#39;s make it something interesting... how about &#39;This is an interesting heading&#39;?",
    "As we come to a close it&#39;s only fitting to discuss the &#39;p&#39; or paragraph tag. This tag can hold tons of text! Think paragraphs full of text! In this example we call it &#39;A simple paragraph&#39; but it is far from that. In fact, you can add whatever you want into any of these examples to truly make it your own! We&#39;ve pizzazzed ours up a little bit, adding teal text on a silver background!"];

var dom = require("ace/lib/dom");

class AcePlayground extends HTMLElement {
    constructor() {
        super();

        var shadow = this.attachShadow({mode: "open"});

        var dom = require("ace/lib/dom");
        dom.buildDom(["div", { id: "host" },
            ["div", { id: "html" }],
            ["div", { id: "css" }],
            ["iframe", { id: "preview" }],
            ["style", `
                #host {
                    padding: 0px;
                    margin: 1% 15% 2.5% 15%;
                    border: solid 4px gray;
                    display: grid;
                    background: #141414;
                    grid-template-areas: "html preview" "css preview";
                }
                #html {
                    grid-area: html;
                    height: 175px;
                    width: 100%;
                }
                #css {
                    grid-area: css;
                    height: 175px;
                    width: 100%;
                }
                #preview {
                    grid-area: preview;
                    width: 50%%;
                    height: 100%;
                    border: none;
                }
            `]
        ], shadow);

        // create html editor
        var htmlEditor = ace.edit(shadow.querySelector("#html"), {
            theme: "ace/theme/twilight",
            mode: "ace/mode/html",
            value: htmlExamples[0],
            autoScrollEditorIntoView: true
        });
        // create css editor
        var cssEditor = ace.edit(shadow.querySelector("#css"), {
            theme: "ace/theme/twilight",
            mode: "ace/mode/css",
            value: cssExamples[0],
            autoScrollEditorIntoView: true
        });

        // set up reset button
        document.getElementById("editor__reset").addEventListener("click", function () {
            // Clear ace editor
            count = 0;
            htmlEditor.setValue(htmlExamples[count]);
            cssEditor.setValue(cssExamples[count]);
            document.getElementById('description').innerHTML = descriptions[count];

        });

        // set up run button
        document.getElementById("editor__run").addEventListener("click", function () {
            // show different tag demos
            // delay output of scripts by 1 second
            setTimeout(function () {
                htmlEditor.setValue(htmlExamples[count]);
                cssEditor.setValue(cssExamples[count]);
                document.getElementById('description').innerHTML = descriptions[count];
            }, delayInMilliseconds);

            if (count == htmlExamples.length - 1) {
                count = 0;
            }
            else {
                count += 1;
            }
        });

        var preview = shadow.querySelector("#preview");

        this.htmlEditor = htmlEditor;
        this.cssEditor = cssEditor;
        this.preview = preview;

        htmlEditor.renderer.attachToShadowRoot();

        this.updatePreview = this.updatePreview.bind(this)
        htmlEditor.on("input", this.updatePreview);
        cssEditor.on("input", this.updatePreview);

        this.updatePreview();
    }
    /*updates the preview window */
    updatePreview() {
        var code = this.htmlEditor.getValue() + "<style>" + this.cssEditor.getValue() + "</style>";
        this.preview.src = "data:text/html," + encodeURIComponent(code)
    }
}

customElements.define('ace-playground', AcePlayground);

window.add = function() {
    var el = document.createElement("ace-playground");
    document.body.appendChild(el);
};


