import { type Shape } from "./types.js";
import { filterActiveTargets } from "./combos.js";
import type { Action } from "./keys.js";
import { nextBlock, pauseGame } from "./main.js";

const settingsPanel = document.getElementById("settings-panel") as HTMLDivElement;
settingsPanel.addEventListener("click", () => {
    pauseGame();
});

/* Setup */

const randomizeElement = document.querySelector("#randomize-toggle") as HTMLInputElement;

export let randomizeMode = false;

randomizeElement.addEventListener("input", () => {
    randomizeMode = randomizeElement.checked;
});

const targetSelectElement = document.getElementById("target-select") as HTMLDivElement;

export const selectedShapes: Shape[] = ["I", "O", "T", "S", "Z", "J", "L"];
const shapes: Shape[] = ["I", "O", "T", "S", "Z", "J", "L"];
function getSelectedShapes(): Shape[] {
    const newShapes: Shape[] = [];
    const checkboxes = targetSelectElement.querySelectorAll("input[type=checkbox]") as NodeListOf<HTMLInputElement>;
    for (let i = 0; i < checkboxes.length; i++) {
        const checkbox = checkboxes[i];
        if (checkbox.checked) {
            newShapes.push(shapes[i]);
        }
    }
    return newShapes;
}

targetSelectElement.addEventListener("click", () => {
    selectedShapes.length = 0;
    selectedShapes.push(...getSelectedShapes());
    filterActiveTargets(selectedShapes);
    nextBlock();
});

/* Settings */

export let DAS = Number(localStorage.getItem("DAS")) || 170;
export let ARR = Number(localStorage.getItem("ARR")) || 30;
if (ARR <= 0) {
    ARR = 0.001;
}
let dropSpeed = Number(localStorage.getItem("dropSpeed")) || 3;
export let dropInterval = 1000 / 3;

const dasInput = document.getElementById("das-input") as HTMLInputElement;
dasInput.value = DAS.toString();
(dasInput.nextElementSibling as HTMLOutputElement).value = DAS.toString();
dasInput.addEventListener("input", () => {
    DAS = parseInt(dasInput.value, 10);
    localStorage.setItem("DAS", DAS.toString());
});

const arrInput = document.getElementById("arr-input") as HTMLInputElement;
arrInput.value = ARR.toString();
(arrInput.nextElementSibling as HTMLOutputElement).value = ARR.toString();
arrInput.addEventListener("input", () => {
    ARR = parseInt(arrInput.value, 10);
    localStorage.setItem("ARR", ARR.toString());
    if (ARR <= 0) {
        ARR = 0.001;
    }
});


const dropSpeedInput = document.getElementById("drop-speed") as HTMLInputElement;
dropSpeedInput.value = dropSpeed.toString();
(dropSpeedInput.nextElementSibling as HTMLOutputElement).value = "3";
dropSpeedInput.addEventListener("input", () => {
    dropSpeed = parseFloat(dropSpeedInput.value);
    localStorage.setItem("dropSpeed", dropSpeed.toString());
    if (dropSpeed <= 0) {
        dropInterval = Infinity;
    } else {
        dropInterval = 1000 / dropSpeed;
    }
});

const resetHandlingDefaultButton = document.getElementById("reset-handling-default-button") as HTMLButtonElement;
resetHandlingDefaultButton.addEventListener("click", () => {
    dasInput.value = "170";
    (dasInput.nextElementSibling as HTMLOutputElement).value = "170";
    DAS = 170;
    localStorage.setItem("DAS", "170");
    arrInput.value = "30";
    (arrInput.nextElementSibling as HTMLOutputElement).value = "30";
    ARR = 30;
    localStorage.setItem("ARR", "30");
    dropSpeedInput.value = "3";
    (dropSpeedInput.nextElementSibling as HTMLOutputElement).value = "3";
    dropInterval = 1000 / 3;
    localStorage.setItem("dropSpeed", "3");
});
const resetHandlingGraceButton = document.getElementById("reset-handling-grace-button") as HTMLButtonElement;
resetHandlingGraceButton.addEventListener("click", () => {
    dasInput.value = "100";
    (dasInput.nextElementSibling as HTMLOutputElement).value = "100";
    DAS = 100;
    localStorage.setItem("DAS", "100");
    arrInput.value = "0";
    (arrInput.nextElementSibling as HTMLOutputElement).value = "0";
    ARR = 0.001;
    localStorage.setItem("ARR", "0");
    dropSpeedInput.value = "3";
    (dropSpeedInput.nextElementSibling as HTMLOutputElement).value = "3";
    dropInterval = 1000 / 3;
    localStorage.setItem("dropSpeed", "3");
});

export let showGhost = true;
export let shadeTarget = false;
export let showGridLines = true;
export let showGridNumbers = true;
export let showFinesseHint = true;
const showGhostInput = document.getElementById("show-ghost") as HTMLInputElement;
if (localStorage.getItem("showGhost") !== null) {
    showGhost = localStorage.getItem("showGhost") === "true";
    showGhostInput.checked = showGhost;
}
showGhostInput.addEventListener("input", () => {
    console.log("hi");
    showGhost = showGhostInput.checked;
    localStorage.setItem("showGhost", showGhost.toString());
});

const shadeTargetInput = document.getElementById("shade-target") as HTMLInputElement;
if (localStorage.getItem("shadeTarget") !== null) {
    shadeTarget = localStorage.getItem("shadeTarget") === "true";
    shadeTargetInput.checked = shadeTarget;
}
shadeTargetInput.addEventListener("input", () => {
    shadeTarget = shadeTargetInput.checked;
    localStorage.setItem("shadeTarget", shadeTarget.toString());
});

const showGridLinesInput = document.getElementById("show-grid-lines") as HTMLInputElement;
if (localStorage.getItem("showGridLines") !== null) {
    showGridLines = localStorage.getItem("showGridLines") === "true";
    showGridLinesInput.checked = showGridLines;
}
showGridLinesInput.addEventListener("input", () => {
    localStorage.setItem("showGridLines", showGridLinesInput.checked.toString());
    showGridLines = showGridLinesInput.checked;
});

const showGridNumbersInput = document.getElementById("show-grid-numbers") as HTMLInputElement;
if (localStorage.getItem("showGridNumbers") !== null) {
    showGridNumbers = localStorage.getItem("showGridNumbers") === "true";
    showGridNumbersInput.checked = showGridNumbers;
}
showGridNumbersInput.addEventListener("input", () => {
    localStorage.setItem("showGridNumbers", showGridNumbersInput.checked.toString());
    showGridNumbers = showGridNumbersInput.checked;
});

const showFinesseHintInput = document.getElementById("show-finesse-hint") as HTMLInputElement;
if (localStorage.getItem("showFinesseHint") !== null) {
    showFinesseHint = localStorage.getItem("showFinesseHint") === "true";
    showFinesseHintInput.checked = showFinesseHint;
}
showFinesseHintInput.addEventListener("input", () => {
    localStorage.setItem("showFinesseHint", showFinesseHintInput.checked.toString());
    showFinesseHint = showFinesseHintInput.checked;
});


/* Keypresses */

// user clicks on keybind button, then presses a key to set keybind

const keybinds: { [action: string]: string } = {
    left: "ArrowLeft",
    right: "ArrowRight",
    cw: "ArrowUp",
    ccw: "KeyZ",
    "180": "KeyA",
    harddrop: "Space",
};

const storedKeybindString = localStorage.getItem("keybinds");
if (storedKeybindString != null) {
    const storedKeybinds = JSON.parse(storedKeybindString);
    for (const action in storedKeybinds) {
        keybinds[action] = storedKeybinds[action];
    }
}

export const keyMap: Record<string, Action> = {};

function updateKeyMap() {
    // clear keyMap
    for (const key in keyMap) {
        delete keyMap[key];
    }
    // repopulate keyMap
    for (const action in keybinds) {
        const key = keybinds[action];
        keyMap[key] = action as Action;
    }

    console.log("Updated keyMap:", keyMap);
}

updateKeyMap();


const keybindButtons = document.querySelectorAll(".keybind-button") as NodeListOf<HTMLButtonElement>;


keybindButtons.forEach((button) => {
    const action = button.id.replace("keybind-", "");
    const output = button.previousElementSibling as HTMLOutputElement;
    output.value = keybinds[action];
    button.addEventListener("click", () => {
        output.value = "press a key...";
        const onKeydown = (e: KeyboardEvent) => {
            e.preventDefault();
            // check if key is already bound
            if (Object.values(keybinds).includes(e.code) && keybinds[action] !== e.code) {
                console.log(keybinds[action], e.code);
                output.style.color = "lightcoral";
                output.value = "in use, try again";
                // doesn't remove listener so user can try again
            } else {
                keybinds[action] = e.code;
                updateKeyMap();
                localStorage.setItem("keybinds", JSON.stringify(keybinds));
                output.style.color = "inherit";
                output.value = e.code;
                document.removeEventListener("keydown", onKeydown);
            }
        };
        document.addEventListener("keydown", onKeydown);
    }); 
});

const resetKeybindDefaultButton = document.getElementById("reset-keybind-default-button") as HTMLButtonElement;
resetKeybindDefaultButton.addEventListener("click", () => {
    keybinds.left = "ArrowLeft";
    keybinds.right = "ArrowRight";
    keybinds.cw = "ArrowUp";
    keybinds.ccw = "KeyZ";
    keybinds["180"] = "KeyA";
    keybinds.harddrop = "Space";
    // update outputs
    keybindButtons.forEach((button) => {
        const action = button.id.replace("keybind-", "");
        const output = button.previousElementSibling as HTMLOutputElement;
        output.value = keybinds[action];
    });
    localStorage.setItem("keybinds", JSON.stringify(keybinds));
    // update keyMap
    updateKeyMap();
});

const resetKeybindGraceButton = document.getElementById("reset-keybind-grace-button") as HTMLButtonElement;
resetKeybindGraceButton.addEventListener("click", () => {
    keybinds.left = "ArrowLeft";
    keybinds.right = "ArrowRight";
    keybinds.cw = "KeyD";
    keybinds.ccw = "KeyA";
    keybinds["180"] = "KeyS";
    keybinds.harddrop = "Space";
    // update outputs
    keybindButtons.forEach((button) => {
        const action = button.id.replace("keybind-", "");
        const output = button.previousElementSibling as HTMLOutputElement;
        output.value = keybinds[action];
    });
    localStorage.setItem("keybinds", JSON.stringify(keybinds));
    // update keyMap
    updateKeyMap();
});


/* Export / Import Config */

const exportButton = document.getElementById("export-button") as HTMLButtonElement;
exportButton.addEventListener("click", () => {
    const config = {
        DAS,
        ARR,
        dropSpeed,
        keybinds,
        showGhost,
        showGridLines,
        shadeTarget,
        showGridNumbers,
        showFinesseHint,
        selectedShapes,
        randomizeMode,
    };
    const configString = JSON.stringify(config, null, 2);
    const blob = new Blob([configString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "finesse-config.json";
    a.click();
    URL.revokeObjectURL(url);
});

const importButton = document.getElementById("import-button") as HTMLButtonElement;
const importFileInput = document.getElementById("import-file-input") as HTMLInputElement;
importButton.addEventListener("click", () => {
    importFileInput.click();
});

importFileInput.addEventListener("change", () => {
    const file = importFileInput.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
        try {
            const config = JSON.parse(reader.result as string);

            if (!config.DAS || config.DAS < 0 || config.DAS > 333) throw new Error("Invalid DAS value");
            if (!config.ARR || config.ARR < 0 || config.ARR > 83) throw new Error("Invalid ARR value");
            if (!config.dropSpeed || config.dropSpeed < 0 || config.dropSpeed > 20) throw new Error("Invalid dropSpeed value");
            if (typeof config.keybinds !== "object") throw new Error("Invalid keybinds");
            if (typeof config.showGhost !== "boolean") throw new Error("Invalid showGhost value");
            if (typeof config.shadeTarget !== "boolean") throw new Error("Invalid shadeTarget value");
            if (typeof config.showGridLines !== "boolean") throw new Error("Invalid showGridLines value");
            if (typeof config.showGridNumbers !== "boolean") throw new Error("Invalid showGridNumbers value");
            if (typeof config.showFinesseHint !== "boolean") throw new Error("Invalid showFinesseHint value");
            if (!Array.isArray(config.selectedShapes)) throw new Error("Invalid selectedShapes value");
            if (typeof config.randomizeMode !== "boolean") throw new Error("Invalid randomizeMode value");

            // apply config
            DAS = config.DAS;
            localStorage.setItem("DAS", DAS.toString());
            ARR = config.ARR;
            localStorage.setItem("ARR", ARR.toString());
            dropSpeed = config.dropSpeed;
            localStorage.setItem("dropSpeed", dropSpeed.toString());
            if (dropSpeed <= 0) {
                dropInterval = Infinity;
            } else {
                dropInterval = 1000 / dropSpeed;
            }
            Object.assign(keybinds, config.keybinds);
            localStorage.setItem("keybinds", JSON.stringify(keybinds));
            showGhost = config.showGhost;
            localStorage.setItem("showGhost", showGhost.toString());
            shadeTarget = config.shadeTarget;
            localStorage.setItem("shadeTarget", shadeTarget.toString());
            showGridLines = config.showGridLines;
            localStorage.setItem("showGridLines", showGridLines.toString());
            showGridNumbers = config.showGridNumbers;
            localStorage.setItem("showGridNumbers", showGridNumbers.toString());
            showFinesseHint = config.showFinesseHint;
            localStorage.setItem("showFinesseHint", showFinesseHint.toString());
            selectedShapes.length = 0;
            selectedShapes.push(...config.selectedShapes);
            filterActiveTargets(selectedShapes);
            randomizeMode = config.randomizeMode;
            nextBlock();

            // update UI elements
            dasInput.value = DAS.toString();
            arrInput.value = ARR.toString();
            dasInput.nextElementSibling!.textContent = DAS.toString();
            arrInput.nextElementSibling!.textContent = Math.floor(ARR).toString();
            dropSpeedInput.value = dropSpeed.toString();
            dropSpeedInput.nextElementSibling!.textContent = dropSpeed.toString();
            showGhostInput.checked = showGhost;
            showGridLinesInput.checked = showGridLines;
            showGridNumbersInput.checked = showGridNumbers;
            showFinesseHintInput.checked = showFinesseHint;
            shadeTargetInput.checked = shadeTarget;
            const checkboxes = targetSelectElement.querySelectorAll("input[type=checkbox]") as NodeListOf<HTMLInputElement>;
            checkboxes.forEach((checkbox, index) => {
                checkbox.checked = selectedShapes.includes(shapes[index]);
            });
            randomizeElement.checked = randomizeMode;

            // update keybind outputs
            keybindButtons.forEach((button) => {
                const action = button.id.replace("keybind-", "");
                const output = button.previousElementSibling as HTMLOutputElement;
                output.value = keybinds[action];
            });

            console.log("Config imported successfully");
        } catch (e) {
            console.error("Failed to import config:", e);
        }
    };
    reader.readAsText(file);
});