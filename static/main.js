document.addEventListener('DOMContentLoaded', function() {
    // Define button variables
    const dashboardBtn = document.getElementById('dashboardBtn');
    const forecastBtn = document.getElementById('forecastBtn');
    const dailyBtnd = document.getElementById('dailyBtnd');
    const weeklyBtnd = document.getElementById('weeklyBtnd');
    const monthlyBtnd = document.getElementById('monthlyBtnd');
    const yearlyBtnd = document.getElementById('yearlyBtnd');

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
                <button class="btnd-active">Daily</button>
                <button class="btnd">Weekly</button>
                <button class="btnd">Monthly</button>
                <button class="btnd btnd-rounded">Yearly</button>
            </div>
            <h2 class="text-3xl font-bold text-blue-700 mb-4">Sales by Product</h2>
            <div class="flex mb-8">
                <button class="btnd-active">Daily</button>
                <button class="btnd">Weekly</button>
                <button class="btnd">Monthly</button>
                <button class="btnd btnd-rounded">Yearly</button>
            </div>
        `;
    }

    // Function to render financial forecast content
    function renderForecast() {
        document.getElementById('content').innerHTML = `
         <h1 class="text-4xl font-bold text-blue-700 mb-8">Financial Forecast</h1>
        <h2 class="text-3xl font-bold text-blue-700 mb-4">Predicted Sales</h2>
            <div class="flex mb-8">
                <button class="btnd-active">Daily</button>
                <button class="btnd">Weekly</button>
                <button class="btnd">Monthly</button>
                <button class="btnd btnd-rounded">Yearly</button>
            </div>

        <div class="fingenius">
        <h2 class="text-3xl font-bold text-blue-700 mb-4">FinGenius</h2>
        <img src="static/images/FinGenius.png" alt="FinGenius Logo" class="logo"> <!-- Replace with your logo path -->
        <div class="message-box">
            <p>Welcome to FinGenius! Your financial insights start here.</p>
        </div>
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

 dailyBtnd.addEventListener('click', function() {
    setActiveButton(dailyBtnd);
    //lalagyan ng render function
});

weeklyBtnd.addEventListener('click', function() {
    setActiveButton(weeklyBtnd);
    
});

monthlyBtnd.addEventListener('click', function() {
    setActiveButton(monthlyBtnd);
    
});

yearlyBtnd.addEventListener('click', function() {
    setActiveButton(yearlyBtnd);
    
});
    // Initial render
    renderDashboard(); // Optionally render the dashboard by default on page load
});