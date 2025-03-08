document.addEventListener('DOMContentLoaded', function() {
    // Define button variables
    const dashboardBtn = document.getElementById('dashboardBtn');
    const forecastBtn = document.getElementById('forecastBtn');

    // Function to set active button
    function setActiveButton(activeButton) {
        // Remove active class from both buttons
        dashboardBtn.classList.remove('btn-active');
        forecastBtn.classList.remove('btn-active');

        // Add active class to the clicked button
        activeButton.classList.add('btn-active');
    }

    // Function to render dashboard content
    function renderDashboard() {
        document.getElementById('content').innerHTML = `
            <h1 class="text-4xl font-bold text-blue-700 mb-8">Dashboard</h1>
            <div class="flex justify-between mb-8">
                <div class="card">
                    <div class="text-lg">Today</div>
                    <div class="text-6xl font-bold">n</div>
                    <div class="text-green-500 mt-2">+20%</div>
                </div>
                <div class="card">
                    <div class="text-lg">Yesterday</div>
                    <div class="text-6xl font-bold">n</div>
                </div>
                <div class="card">
                    <div class="text-lg">Average</div>
                    <div class="text-6xl font-bold">n</div>
                    <div class="text-red-500 mt-2">-50%</div>
                </div>
            </div>
            <h2 class="text-3xl font-bold text-blue-700 mb-4">Sales</h2>
            <div class="flex mb-8">
                <button class="btn-active">Daily</button>
                <button class="btn">Weekly</button>
                <button class="btn">Monthly</button>
                <button class="btn btn-rounded">Yearly</button>
            </div>
        `;
    }

    // Function to render financial forecast content
    function renderForecast() {
        document.getElementById('content').innerHTML = `
            <h1 class="text-4xl font-bold text-blue-700 mb-8">Financial Forecast</h1>
            <p>Your financial forecast content goes here.</p>
            <div class="flex mb-8">
                <button class="btn">Daily</button>
                <button class="btn">Weekly</button>
                <button class="btn">Monthly</button>
                <button class="btn btn-rounded">Yearly</button>
            </div>
        `;
    }

    // Event listeners for button clicks
    dashboardBtn.addEventListener('click', function() {
        setActiveButton(dashboardBtn);
        renderDashboard();
    });

    forecastBtn.addEventListener('click', function() {
        setActiveButton(forecastBtn);
        renderForecast();
 });

    // Initial render
    renderDashboard(); // Optionally render the dashboard by default on page load
});