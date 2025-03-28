let salesChart;

document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function () {
        document.querySelectorAll('.btn').forEach(btn => btn.classList.remove('btnd-active'));
        this.classList.add('btnd-active');
    });
});

function fetchData(timeframe) {
    fetch(`/api/${timeframe}-sales-data`)
        .then(response => response.json())
        .then(data => updateChart(data.labels, data.values, timeframe));
}

function updateChart(labels, values, timeframe) {
    try {
        const ctx = document.getElementById('salesChart').getContext('2d');
        if (salesChart) salesChart.destroy();

        salesChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: `Sales (${timeframe})`,
                    data: values,
                    borderColor: '#3b82f6',
                    fill: false,
                    tension: 0.4
                }]
            }
        });
    } catch (error) {
        console.error('Error updating the chart:', error);
        alert("An error occurred while updating the chart.");
    }
}

fetchData('daily'); // Load daily data by default