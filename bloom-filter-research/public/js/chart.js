let chartInstance = null
let modalChartInstance = null

async function updateGraph() {
    const result = await fetchData('/api/devices/graph-data')

    if (!result) return

    const ctx = document.getElementById("falsePositiveChart").getContext("2d")
    if (chartInstance) chartInstance.destroy()

    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: result.xAxis,
            datasets: [
                { label: 'Traditional', data: result.traditional, borderColor: 'blue', fill: false },
                { label: 'Counting', data: result.counting, borderColor: 'red', fill: false },
                { label: 'Scalable', data: result.scalable, borderColor: 'green', fill: false }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    type: "logarithmic",
                    title: { display: true, text: "False Positive Rate" },
                    ticks: { callback: value => {
                        if (value < 0.01) return value.toExponential(1)
                        return Number(value.toPrecision(2))
                    }}
                },
                x: { title: { display: true, text: "Number of Elements" } }
            }
        }
    })

    updateChartModal()
}

function updateChartModal() {
    const ctx = document.getElementById("modalChart").getContext("2d")
    if (modalChartInstance) modalChartInstance.destroy()
    modalChartInstance = new Chart(ctx, chartInstance.config)
}

async function openChartModal() {
    document.getElementById("chartModal").style.display = "flex"

    if (!chartInstance) {
        await updateGraph() // Fetch and create the chart if it doesn't exist
    }

    updateChartModal()
}

function closeChartModal() {
    document.getElementById("chartModal").style.display = "none"
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("chartModal").style.display = "none"
    updateGraph()
})
