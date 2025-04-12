document.addEventListener('DOMContentLoaded', function() {
    // Define button variables
    const dashboardBtn = document.getElementById('dashboardBtn');
    const forecastBtn = document.getElementById('forecastBtn');
    
    const chatbotBtn = document.getElementById('chatbotBtn');
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('btn');
    const mainContainer = document.querySelector('.main-container');

    const closeSidebar = () => {
        sidebar.classList.remove("active");
        mainContainer.classList.remove("shifted");
    };

    document.getElementById("dashboardBtn").addEventListener("click", closeSidebar);
    document.getElementById("forecastBtn").addEventListener("click", closeSidebar);
    document.querySelector(".AI-InsightsBtn").addEventListener("click", closeSidebar);

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
    <h1 class="text-4xl font-bold mb-8" style="color: #0E7490;">Financial Forecast</h1>
    <h2 class="text-3xl font-bold text-blue-700 mb-4" style="color: #0E7490;">Predicted Sales</h2>
            <div class="flex mb-8">
                <button class="btnd-active">Daily</button>
                <button class="btnd">Weekly</button>
                <button class="btnd">Monthly</button>
                <button class="btnd btnd-rounded">Yearly</button>
            </div>
   
            <div class="fingenius">
                <img src="static/images/FinGenius.png" alt="FinGenius Logo" class="logo"> <!-- Replace with your logo path -->
                <h2 class="text-3xl font-bold text-blue-700 mr-4" style="color: #0E7490;">FinGenius</h2>
                <div class="message-box">
                    <p>Welcome to FinGenius! Your financial insights start here.</p>
                </div>
                <button id="chatbotBtn" class="btn-chat">Chat with FinGenius</button> <!-- Chat button -->
            </div>
        `;
    
        // Now attach the event listener for the chatbot button after it's rendered
        const chatbotBtn = document.getElementById("chatbotBtn");
    
        // Ensure the button exists before adding event listener
        if (chatbotBtn) {
            chatbotBtn.addEventListener('click', function() {
                // Call createChatbox function when the button is clicked
                createChatbox();
            });
        }
    }    
    
    // Function to create the chatbox
        function createChatbox() {
            if (!document.getElementById('chatboxContainer')) {
                let chatbox = document.createElement('div');
                chatbox.id = 'chatboxContainer';
                chatbox.innerHTML = `
                    <div id="chatbox" class="chatbox">
                        <div class="chatbox-header">
                            <img src="static/images/FinGenius.png" alt="FinGenius Logo" class="logo">
                            <h2 class="text-3xl font-bold text-white-700 mr-20 mt-2">FinGenius</h2>
                            <button id="closeChatbox">X</button>
                        </div>
                        <div class="chatbox-body">
                            <p>Welcome! How can I assist you?</p>
                        </div>
                        <input type="text" id="chatInput" placeholder="Type a message..." />
                        <button id="sendButton">Send</button> <!-- Added Send button -->
                    </div>
                `;
                document.body.appendChild(chatbox);
    
                // Close button functionality
                document.getElementById('closeChatbox').addEventListener('click', function() {
                    document.getElementById('chatboxContainer').remove();
                });
    
                // Send button functionality
                document.getElementById('sendButton').addEventListener('click', function() {
                    let chatInput = document.getElementById('chatInput');
                    let chatboxBody = document.querySelector('.chatbox-body');
                    let userMessage = chatInput.value;
                    chatInput.value = ''; // Clear input field after sending
    
                    // Display user message
                    let userMessageElement = document.createElement('p');
                    userMessageElement.className = 'user-message';
                    userMessageElement.innerHTML = userMessage;
                    chatboxBody.appendChild(userMessageElement);
    
                    // Display chatbot response (Placeholder for now)
                    let chatbotResponse = getChatbotResponse(userMessage);
                    let chatbotResponseElement = document.createElement('p');
                    chatbotResponseElement.className = 'chatbot-response';
                    chatbotResponseElement.innerHTML = chatbotResponse;
                    chatboxBody.appendChild(chatbotResponseElement);
                });
            }
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

    

    // Event listener for chatbot button
    chatbotBtn.addEventListener('click', function() {
        createChatbox(); // Directly call createChatbox
    });

    // Initial render
    renderDashboard(); // Optionally render the dashboard by default on page load
});