const $sensibilityInput = document.getElementById("sensibility-input");
const $histeresisInput = document.getElementById("histeresis-input");
const $sensibilityCurrentVal = document.getElementById("sensibility-currentValue");
const $histeresisCurrentVal = document.getElementById("histeresis-currentValue");

function resetConfigForm() {
    const DEFAULT_SENSIBILITY = -102;
    const DEFAULT_HISTERESIS = 13;

    const sensVal = DEFAULT_SENSIBILITY;
    const histVal = DEFAULT_HISTERESIS;

    $sensibilityInput.value = DEFAULT_SENSIBILITY;
    $histeresisInput.value = DEFAULT_HISTERESIS;
    
    setConfig({sensVal, histVal});
}

function applyConfigForm() {
    const sensVal = $sensibilityInput.value;
    const histVal = $histeresisInput.value;

    setConfig({sensVal, histVal});
}

function setConfig({sensVal, histVal}) {
    // update UI
    $sensibilityCurrentVal.innerText = `(${sensVal} dBm)`;
    $histeresisCurrentVal.innerText = `(${histVal} dBm)`;

    // save on local storage
    localStorage.setItem("sensVal", sensVal);
    localStorage.setItem("histVal", histVal);
}

function getConfig() {
    const sensVal = localStorage.getItem("sensVal");
    const histVal = localStorage.getItem("histVal");

    $sensibilityInput.value = sensVal;
    $histeresisInput.value = histVal;

    setConfig({sensVal, histVal});
}

document.getElementById("config__reset-btn").addEventListener("click", () => resetConfigForm());
document.getElementById("config__apply-btn").addEventListener("click", () => applyConfigForm());

getConfig();