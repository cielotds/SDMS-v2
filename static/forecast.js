function drawLineChart(canvasId, data, label) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    const labels = data.map(item => item.date);
    const values = data.map(item => item.predicted_sales);

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: label,
                data: values,
                borderColor: 'blue',
                fill: false
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    fetch("/api/predicted_sales")
        .then(response => response.json())
        .then(data => {
            console.log("Fetched data:", data);
            drawLineChart("dailyPredictedSalesChart", data.daily, "Daily Predicted Sales");
            drawLineChart("weeklyPredictedSalesChart", data.weekly, "Weekly Predicted Sales");
            drawLineChart("monthlyPredictedSalesChart", data.monthly, "Monthly Predicted Sales");
            drawLineChart("yearlyPredictedSalesChart", data.yearly, "Yearly Predicted Sales");
        })
        .catch(error => console.error("Error fetching forecast data:", error));
});