async function fetchData(url, method = "GET", body = null) {
    try {
        const options = {
            method,
            headers: { "Content-Type": "application/json" },
            ...(body && { body: JSON.stringify(body) }) // Add body only if it exists
        }
        const response = await fetch(url, options)
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`)
        return await response.json()
    } catch (error) {
        console.error("Error:", error)
        alert("An error occurred.")
        return null
    }
}

async function handleDeviceAction(action) {
    const deviceId = document.getElementById("deviceId").value.trim()
    if (!deviceId) return alert("Please enter a device ID.")

    const apiEndpoints = {
        add: "/api/devices/add",
        remove: "/api/devices/remove",
        check: `/api/devices/check/${deviceId}`
    }

    const method = action === "check" ? "GET" : "POST"
    const body = action === "check" ? null : { deviceId }

    const result = await fetchData(apiEndpoints[action], method, body)

    if (result) {
        if (action === "check") {
            document.getElementById("checkResult").innerText = `
                Traditional: ${result.traditional}, 
                Counting: ${result.counting}, 
                Scalable: ${result.scalable}, 
                Actual: ${result.actual}
            `
        } else {
            alert(result.message)
        }
    }
}

async function addMultipleDevices() {
    const prefix = document.getElementById("prefix").value.trim()
    const start = parseInt(document.getElementById("startRange").value)
    const end = parseInt(document.getElementById("endRange").value)

    if (!prefix || isNaN(start) || isNaN(end) || start > end) {
        return alert("Please enter a valid prefix and number range (start ≤ end).")
    }

    const result = await fetchData("/api/devices/add-multiple", "POST", { start, end, prefix })
    if (result) alert(result.message)
}

async function checkFalsePositives() {
    const result = await fetchData('/api/devices/false-positive')
    if (result) {
        document.getElementById("falsePositiveRate").innerHTML = `
            <strong>False Positive Rates:</strong><br>
            Traditional: ${result.traditional}<br>
            Counting: ${result.counting}<br>
            Scalable: ${result.scalable}
        `
    }
}
