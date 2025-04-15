document.addEventListener('DOMContentLoaded', function () {
    // Define elements
    const dashboardBtn = document.getElementById('dashboardBtn');
    const forecastBtn = document.getElementById('forecastBtn');
    const insightsBtn = document.getElementById('insightsBtn');

    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('btn');
    const mainContainer = document.querySelector('.main-container');
    
    const chatbotBtn = document.getElementById('chatbotBtn'); // Assuming this exists

    // Navigation functions
    const closeSidebar = () => {
        sidebar.classList.remove("active");
        mainContainer.classList.remove("shifted");
    };

    // Toggle sidebar
    toggleBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        sidebar.classList.toggle('active');
        mainContainer.classList.toggle('shifted');
    });

    // Close sidebar when clicking outside
    document.addEventListener('click', function (event) {
        const isClickInsideSidebar = sidebar.contains(event.target);
        const isClickOnToggle = toggleBtn.contains(event.target);
        if (!isClickInsideSidebar && !isClickOnToggle) {
            closeSidebar();
        }
    });

    // Sidebar links close sidebar on click
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', closeSidebar);
    });

    // Highlight current page nav item based on URL path
    function setActiveNavItem() {
        const currentPath = window.location.pathname;
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('btn-active');
        });
        if (currentPath.includes('forecast')) {
            document.querySelector('[href="/forecast"]').classList.add('btn-active');
        } else if (currentPath.includes('insights')) {
            document.querySelector('[href="/insights"]').classList.add('btn-active');
        } else {
            document.querySelector('[href="/"]').classList.add('btn-active');
        }
    }

    // Custom in-app active state
    function setActiveButton(activeButton) {
        dashboardBtn.classList.remove('btn-active');
        forecastBtn.classList.remove('btn-active');
        insightsBtn.classList.remove('btn-active');
        activeButton.classList.add('btn-active');
    }

    // Render functions
    function renderDashboard() {
        document.getElementById('content').innerHTML = `<!-- Dashboard HTML here -->`;
    }

    function renderForecast() {
        document.getElementById('content').innerHTML = `<!-- Forecast HTML here -->`;
    }

    function renderInsights() {
        document.getElementById('content').innerHTML = `<!-- Insights HTML here -->`;
    }

    // Button click event handlers
    dashboardBtn.addEventListener('click', function () {
        setActiveButton(dashboardBtn);
        renderDashboard();
    });

    forecastBtn.addEventListener('click', function () {
        setActiveButton(forecastBtn);
        renderForecast();
    });

    insightsBtn.addEventListener('click', function () {
        setActiveButton(insightsBtn);
        renderInsights();
    });

    // Chatbot trigger
    if (chatbotBtn) {
        chatbotBtn.addEventListener('click', function () {
            createChatbox(); // Assuming this function is defined elsewhere
        });
    }

    // Initialize app
    renderDashboard(); // Default view
    setActiveNavItem();
});
