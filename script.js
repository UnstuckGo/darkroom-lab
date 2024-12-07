function loadSettings() {
    const apiKey = localStorage.getItem("goveeApiKey");
    const macAddress = localStorage.getItem("deviceMacAddress");

    if (apiKey) {
        document.getElementById("api-key").value = apiKey;
    }
    if (macAddress) {
        document.getElementById("mac-address").value = macAddress;
    }
}

loadSettings();

let apiKey = localStorage.getItem("goveeApiKey") || "";
let deviceAddress = localStorage.getItem("deviceMacAddress") || "";
const deviceModel = "H6008"; // Replace with your device's model

const settings = {
    "MULTIGRADE ART 300": {
        "00": { iso: 170, exposureTime: "recommended time" },
        "0": { iso: 160, exposureTime: "recommended time" },
        "1": { iso: 130, exposureTime: "recommended time" },
        "2": { iso: 110, exposureTime: "recommended time" },
        "3": { iso: 90, exposureTime: "recommended time" },
        "4": { iso: 70, exposureTime: "recommended time" },
        "5": { iso: 50, exposureTime: "recommended time" },
    },
    // Add other paper types and their settings similarly...
};

document.getElementById("calculate").addEventListener("click", function() {
    const paperType = document.getElementById("paper-type").value;
    const grade = document.getElementById("grade").value;

    const selectedSettings = settings[paperType][grade];

    if (selectedSettings) {
        document.getElementById("settings-output").innerHTML = \`
            ISO Range: \${selectedSettings.iso}<br>
            Recommended Exposure Time: \${selectedSettings.exposureTime}
        \`;
    } else {
        document.getElementById("settings-output").innerText = "Settings not found.";
    }
});

async function turnOnBulb() {
    const response = await fetch("https://developer-api.govee.com/v1/devices/control", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Govee-API-Key": apiKey,
        },
        body: JSON.stringify({
            device: deviceAddress,
            model: deviceModel,
            cmd: {
                name: "turn",
                value: "on"
            }
        })
    });
    
    const data = await response.json();
    console.log(data); // Log the response from the API
}

document.getElementById("turn-on").addEventListener("click", turnOnBulb);

// Save settings to local storage
document.getElementById("save-settings").addEventListener("click", function() {
    apiKey = document.getElementById("api-key").value;
    deviceAddress = document.getElementById("mac-address").value;

    localStorage.setItem("goveeApiKey", apiKey);
    localStorage.setItem("deviceMacAddress", deviceAddress);
    alert("Settings saved!");
});

// Reset settings
document.getElementById("reset-settings").addEventListener("click", function() {
    localStorage.removeItem("goveeApiKey");
    localStorage.removeItem("deviceMacAddress");
    
    document.getElementById("api-key").value = "";
    document.getElementById("mac-address").value = "";
    
    alert("Settings reset!");
});
