let on = false;
let pyodide;

async function main() {
    pyodide = await loadPyodide();
    console.log("Pyodide loaded");

    var editor = CodeMirror.fromTextArea(document.getElementById("code"), {
        lineNumbers: true,
        mode: "python",
        theme: "night",
        autoCloseBrackets: true,
        viewportMargin: Infinity,
        extraKeys: {
            "Ctrl-Enter": function() {
                runCode(); 
            }
        }
    });

    async function runCode() {
        const op = document.querySelector(".output");
        op.style.display = "block";
        const code = editor.getValue();
        try {
            await pyodide.runPythonAsync(`
                import sys
                import io
                from contextlib import redirect_stdout

                # Create a StringIO buffer to capture output
                buffer = io.StringIO()

                # Redirect stdout to the buffer
                with redirect_stdout(buffer):
                    exec(${JSON.stringify(code)})  # Execute the code

                # Get the output from the buffer
                output = buffer.getvalue()
            `);

            
            let output = pyodide.runPython("output");
            output = output.replace(/\n/g, "<br>");
            document.querySelector(".output").innerHTML = output; // Display output
        } catch (error) {
            document.querySelector(".output").innerHTML = error; // Display error
        }
    }

    const refresh = document.querySelector(".refresh");
    refresh.addEventListener("click",()=>{
        editor.setValue("");
        editor.setCursor({line:0,ch:0});
    });
 const runButton = document.querySelector(".run");
    runButton.addEventListener("click", runCode);
var editorWrapperElement = editor.getWrapperElement();
editorWrapperElement.style.fontSize = "22px";
    editor.setSize("100%", "100%");
}

main();

const menu = document.querySelector(".menu");
const ai = document.querySelector(".ai-help");
const aibox = document.querySelector(".ai");
const dropdownButton = document.querySelector(".dropbutton");
const dropdownExit = document.querySelector(".cross");

dropdownButton.addEventListener('click', () => {
    menu.style.left = "0";
    dropdownButton.style.transform = "rotate(90deg)";
});

dropdownExit.addEventListener('click', () => {
    menu.style.left = "-50%";
    dropdownButton.style.transform = "rotate(0deg)";
});

ai.addEventListener("click", (event) => {
    event.preventDefault();
    if (aibox.style.display === "none" || aibox.style.display === "") {
        aibox.style.display = "flex";
    } else {
        aibox.style.display = "none";
    }
});