document.addEventListener("DOMContentLoaded", function() {
    // Setup for the Daily Sales Chart
    const dailySalesCtx = document.getElementById('dailySalesChart').getContext('2d');
    const dailySalesChart = new Chart(dailySalesCtx, {
        type: 'line',
        data: {
            labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            datasets: [{
                label: 'Daily Sales',
                data: [100, 200, 150, 300, 250, 400, 350],
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true
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

    // Setup for the Weekly Sales Chart
    const weeklySalesCtx = document.getElementById('weeklySalesChart').getContext('2d');
    const weeklySalesChart = new Chart(weeklySalesCtx, {
        type: 'line',
        data: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            datasets: [{
                label: 'Weekly Sales',
                data: [500, 600, 700, 800],
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                fill: true
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

    // Setup for the Monthly Sales Chart
    const monthlySalesCtx = document.getElementById('monthlySalesChart').getContext('2d');
    const monthlySalesChart = new Chart(monthlySalesCtx, {
        type: 'line',
        data: {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'], 
            datasets: [{
                label: 'Monthly Sales',
                data: [1000, 1500, 2000, 2500, 3000, 3500, 4000],
                borderColor: 'rgba(153, 102, 255, 1)',
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                fill: true
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

    // Setup for the Yearly Sales Chart
    const yearlySalesCtx = document.getElementById('yearlySalesChart').getContext('2d');
    const yearlySalesChart = new Chart(yearlySalesCtx, {
        type: 'line',
        data: {
            labels: ['2020', '2021', '2022', '2023', '2024'],
            datasets: [{
                label: 'Yearly Sales',
                data: [10000, 15000, 20000, 25000, 30000],
                backgroundColor: 'rgba(255, 159, 64, 0.2)',
                borderColor: 'rgba(255, 159, 64, 1)',
                fill: true
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

    // Function to hide all charts
    function hideAllCharts() {
        document.getElementById('dailySalesChart').parentNode.style.display = 'none';
        document.getElementById('weeklySalesChartContainer').style.display = 'none';
        document.getElementById('monthlySalesChartContainer').style.display = 'none';
        document.getElementById('yearlySalesChartContainer').style.display = 'none';
    }

    // Event listener for the Daily button
    document.querySelector('.btnd-active').addEventListener('click', function() {
        hideAllCharts();
        document.getElementById('dailySalesChart').parentNode.style.display = 'block'; // Show Daily chart
        document.querySelector('.btnd-active').classList.add('btnd-active');
        document.querySelector('.btnd').classList.remove('btnd-active');
    });

    // Event listener for the Weekly button
    document.querySelector('.btnd:nth-child(2)').addEventListener('click', function() {
        hideAllCharts();
        document.getElementById('weeklySalesChartContainer').style.display = 'block'; // Show Weekly chart
        document.querySelector('.btnd:nth-child(2)').classList.add('btnd-active');
        document.querySelector('.btnd:nth-child(1)').classList.remove('btnd-active');
    });

    // Event listener for the Monthly button
    document.querySelector('.btnd:nth-child(3)').addEventListener('click', function() {
        hideAllCharts();
        document.getElementById('monthlySalesChartContainer').style.display = 'block'; // Show Monthly chart
        document.querySelector('.btnd:nth-child(3)').classList.add('btnd-active');
        document.querySelector('.btnd:nth-child(1)').classList.remove('btnd-active');
    });

    // Event listener for the Yearly button
    document.querySelector('.btnd:nth-child(4)').addEventListener('click', function() {
        hideAllCharts();
        document.getElementById('yearlySalesChartContainer').style.display = 'block'; // Show Yearly chart
        document.querySelector('.btnd:nth-child(4)').classList.add('btnd-active');
        document.querySelector('.btnd:nth-child(1)').classList.remove('btnd-active');
    });

    // Initialize with the Daily chart visible
    hideAllCharts();
    document.getElementById('dailySalesChart').parentNode.style.display = 'block'; // Show Daily chart
});
