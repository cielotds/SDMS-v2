document.addEventListener('DOMContentLoaded', function() {
    // Define button variables
    const dashboardBtn = document.getElementById('dashboardBtn');
    const forecastBtn = document.getElementById('forecastBtn');
    const insightsBtn = document.getElementById('insightsBtn'); 
    
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('btn');
    const mainContainer = document.querySelector('.main-container');

    const closeSidebar = () => {
        sidebar.classList.remove("active");
        mainContainer.classList.remove("shifted");
    };

    document.getElementById("dashboardBtn").addEventListener("click", closeSidebar);
    document.getElementById("forecastBtn").addEventListener("click", closeSidebar);
    document.getElementById("insightsBtn").addEventListener("click", closeSidebar);

    // Toggle sidebar when menu button is clicked
    toggleBtn.addEventListener('click', function () {
        sidebar.classList.toggle('active');
        mainContainer.classList.toggle('shifted');
    });

        // Close sidebar when clicking outside
    document.addEventListener('click', function (event) {
        const isClickInsideSidebar = sidebar.contains(event.target);
        const isClickOnToggle = toggleBtn.contains(event.target);

        if (!isClickInsideSidebar && !isClickOnToggle) {
            sidebar.classList.remove('active');
            mainContainer.classList.remove('shifted');
        }
    }); 

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
     <div class="flex">
        <div class="fixed top-1 left-4 z-50">
            <i class="fas fa-bars text-white p-2 rounded cursor-pointer" id="btn" style="background-color: #0E7490;"></i>
        </div>
        <div class="main-container transition-all duration-300 ease-in-out flex">   
<!-- Sidebar -->
<div class="sidebar p-4" id="sidebar" style="background-color: #0E7490;">
    <div class="text-white text-lg font-bold mb-8">
        <div class="flex items-center mb-8">
            <img src="{{ url_for('static', filename='images/ECONOVISION.png') }}" alt="Logo" class="h-12.5 w-12.5 mr-2">
        </div>
        <div class="flex flex-col space-y-4"> 
            <button id="dashboardBtn" class="flex items-center text-white btn-active"> 
                <i class="fas fa-home mr-2"></i> 
                <span>Dashboard</span> 
            </button> 
            <button id="forecastBtn" class="flex items-center text-white btn"> 
                <i class="fas fa-chart-line mr-2"></i> 
                <span>Financial Forecast</span> 
            </button>
            <button id="insightsBtn" class="flex items-center text-white btn"> 
                <i class="fas fa-robot mr-2"></i>
                <span>AI Insights</span> 
            </button> 
            
            
        </div> 
    </div>
</div>
        <!-- Main Content -->
        <div class="dashboard" id="mainContent">
            <div id="content">         
                <h1 class="text-4xl font-bold mb-8" style="color: #0E7490;">Dashboard</h1>
                <div class="real-time">
                    <div class="card">
                        <div class="text-lg">Today</div>
                        <div class="text-6xl font-bold" id="today-total"></div>
                        <div class="mt-2" id="today-percent"></div>
                    </div>
                    <div class="card">
                        <div class="text-lg">Yesterday</div>
                        <div class="text-6xl font-bold" id="yesterday-total"></div>
                    </div>
                    <div class="card">
                        <div class="text-lg">Average</div>
                        <div class="text-6xl font-bold" id="average-total"></div>
                        <div class="mt-2" id="average-percent"></div>
                    </div>
                </div>
                
                

                <h2 class="text-3xl font-bold text-blue-700 mb-4" style="color: #0E7490;">Sales Overview</h2>
                <div class="chart-container">
                    
                    <div class="chart-box">
                        <h3>Daily Sales</h3>
                        <canvas id="dailySalesChart" ></canvas>
                    </div>
                    <div class="chart-box">
                        <h3>Weekly Sales</h3>
                        <canvas id="weeklySalesChart" ></canvas>
                    </div>
                    <div class="chart-box">
                        <h3>Monthly Sales</h3>
                        <canvas id="monthlySalesChart" ></canvas>
                    </div>
                    <div class="chart-box">
                        <h3>Yearly Sales</h3>
                        <canvas id="yearlySalesChart" ></canvas>
                    </div>
                </div>

                
                <h2 class="text-3xl font-bold text-blue-700 mb-4" style="color: #0E7490;">Sales by Product</h2>
                <div class="chart-container">
                    <div class="chart-box">
                        <h2>Daily Sales</h2>
                        <canvas id="dailySalesByProductChart" ></canvas>
                    </div>
                    <div class="chart-box">
                        <h2>Weekly Sales</h2>
                        <canvas id="weeklySalesByProductChart"></canvas>
                    </div>
                    <div class="chart-box">
                        <h2>Monthly Sales</h2>
                        <canvas id="monthlySalesByProductChart"></canvas>
                    </div>
                    <div class="chart-box">
                        <h2>Yearly Sales</h2>
                        <canvas id="yearlySalesByProductChart"></canvas>
                    </div>
                </div>
            </div>
        </div>
    </div>
        `;
    }

    // Function to render financial forecast content
    function renderForecast() {
        document.getElementById('content').innerHTML = `
<h1 class="text-4xl font-bold text-blue-700 mb-8">Financial Forecast</h1>
    
    <div class="chart-container">

      <div class="chart-box">
      <h3>Daily Forecast</h3>
      <canvas id="dailyPredictedSalesChart"></canvas>
    </div>
    
    <div class="chart-box">
      <h3>Weekly Forecast</h3>
      <canvas id="weeklyPredictedSalesChart"></canvas>
    </div>
    
    <div class="chart-box">
      <h3>Monthly Forecast</h3>
      <canvas id="monthlyPredictedSalesChart"></canvas>
    </div>
    
    <div class="chart-box">
      <h3>Yearly Forecast</h3>
      <canvas id="yearlyPredictedSalesChart"></canvas>
    </div>
    
    </div>
        `;
    }  
    
    function renderInsights() {
        document.getElementById('content').innerHTML = `
    <img src="static/images/FinGenius.png" alt="FinGenius Logo" class="logo">
  <h2 class="text-3xl font-bold text-blue-700 mr-4" style="color: #0E7490;">FinGenius</h2>
  <div class="container">
    <h1>AI Insights and Recommendations</h1>
    <p>Insight Date: <span id="insightDate"></span></p>

    <input type="date" id="datePicker" />
    <button onclick="fetchInsight()">View Insight</button>
    <button onclick="exportPDF()">Export to PDF</button>

    <div class="message-box">
      <p>Hello, I'm FinGenius! Your business insights start here.</p>
    <div id="insightBox">
   
    </div>
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
    insightsBtn.addEventListener('click', function() {
        setActiveButton(insightsBtn);
        renderInsights();
    });
    

    // Event listener for chatbot button
    chatbotBtn.addEventListener('click', function() {
        createChatbox(); // Directly call createChatbox
    });

    // Initial render
    renderDashboard(); // Optionally render the dashboard by default on page load
});