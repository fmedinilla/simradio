const $sensibilityInput = document.getElementById("sensibility-input");
const $histeresisInput = document.getElementById("histeresis-input");
const $sqInitInput = document.getElementById("sq-init-input");
const $sensibilityCurrentVal = document.getElementById("sensibility-currentValue");
const $histeresisCurrentVal = document.getElementById("histeresis-currentValue");
const $sqInitCurrentVal = document.getElementById("sq-init-currentValue");

function resetConfigForm() {
    const DEFAULT_SENSIBILITY = -102;
    const DEFAULT_HISTERESIS = 13;
    const DEFAULT_SQ_INIT = -98;

    const sensVal = DEFAULT_SENSIBILITY;
    const histVal = DEFAULT_HISTERESIS;
    const sqInitVal = DEFAULT_SQ_INIT;

    $sensibilityInput.value = DEFAULT_SENSIBILITY;
    $histeresisInput.value = DEFAULT_HISTERESIS;
    $sqInitInput.value = DEFAULT_SQ_INIT;

    setConfig({sensVal, histVal, sqInitVal});
}

function applyConfigForm() {
    const sensVal = $sensibilityInput.value;
    const histVal = $histeresisInput.value;
    const sqInitVal = $sqInitInput.value;

    setConfig({sensVal, histVal, sqInitVal});
}

function setConfig({sensVal, histVal, sqInitVal}) {
    const minSens = -98 - histVal;

    // update UI
    $sensibilityCurrentVal.innerText = `(${sensVal} dBm | (${minSens}, -98) dBm)`;
    $histeresisCurrentVal.innerText = `(${histVal} dBm)`;
    $sqInitCurrentVal.innerText = `(${sqInitVal} dBm)`;

    // save on local storage
    localStorage.setItem("sensVal", sensVal);
    localStorage.setItem("histVal", histVal);
    localStorage.setItem("sqInitVal", sqInitVal);
}

function getConfig() {
    const sensVal = localStorage.getItem("sensVal") || -102;
    const histVal = localStorage.getItem("histVal") || 13;
    const sqInitVal = localStorage.getItem("sqInitVal") || -98;

    $sensibilityInput.value = sensVal;
    $histeresisInput.value = histVal;
    $sqInitInput.value = sqInitVal;

    setConfig({sensVal, histVal, sqInitVal});
}

document.getElementById("config__reset-btn").addEventListener("click", () => resetConfigForm());
document.getElementById("config__apply-btn").addEventListener("click", () => applyConfigForm());

$histeresisInput.addEventListener("input", () => {
    const histVal = $histeresisInput.value;
    const minSens = -98 - histVal;
    $sensibilityCurrentVal.innerText = `(${$sensibilityInput.value} dBm | (${minSens}, -98) dBm)`;
});

getConfig();