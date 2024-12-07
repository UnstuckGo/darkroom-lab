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
        "00": { iso: 170, exposureTime: "recommended time", color: { r: 255, g: 204, b: 0 } }, // Warm yellow
        "0": { iso: 160, exposureTime: "recommended time", color: { r: 255, g: 150, b: 0 } }, // Slightly warmer
        "1": { iso: 130, exposureTime: "recommended time", color: { r: 255, g: 100, b: 0 } }, // Orange
        "2": { iso: 110, exposureTime: "recommended time", color: { r: 255, g: 50, b: 0 } }, // Bright orange
        "3": { iso: 90, exposureTime: "recommended time", color: { r: 0, g: 0, b: 255 } }, // Blue for higher contrast
        "4": { iso: 70, exposureTime: "recommended time", color: { r: 0, g: 0, b: 220 } }, // Dark blue
        "5": { iso: 50, exposureTime: "recommended time", color: { r: 0, g: 0, b: 180 } }, // Deeper blue
    },
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
        // Set the bulb color based on the selected filter's color
        setBulbColor(selectedSettings.color.r, selectedSettings.color.g, selectedSettings.color.b);
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

// Safelight toggle functionality
document.getElementById('safelight-toggle').addEventListener('change', function() {
    const safelightOn = this.checked;

    if (safelightOn) {
        // Set appropriate color for safelight (red light)
        setBulbColor(255, 0, 0); // RGB for red color for safelight
    } else {
        // Turn off the bulb or reset it to the previous state
        turnOffBulb();
    }
});

// Function to set the bulb color
async function setBulbColor(r, g, b) {
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
                name: "color",
                value: { r, g, b }
            }
        })
    });

    const data = await response.json();
    console.log(data); // Log the response from the API
}

// Function to turn off the bulb
async function turnOffBulb() {
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
                value: "off"
            }
        })
    });

    const data = await response.json();
    console.log(data); // Log the response from the API
}
