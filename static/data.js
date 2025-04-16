// Function to fetch data from the database (Real-time data)
function fetchData() {
    fetch('/api/realtime')
        .then(response => response.json())
        .then(data => {
            // Update total sales
            document.getElementById('today-total').textContent = data.today;
            document.getElementById('yesterday-total').textContent = data.yesterday;
            document.getElementById('average-total').textContent = data.average;

            // Function to update percentage elements
            const updatePercent = (elementId, percentValue) => {
                const element = document.getElementById(elementId);
                const value = parseFloat(percentValue); // Ensure it's a number
                const sign = value >= 0 ? "+" : "";
                element.textContent = `${sign}${value}%`;
                element.className = value >= 0 ? "text-green-700 mt-2" : "text-red-700 mt-2";
            };

            // Update today's and average percentages
            updatePercent('today-percent', data.percent_today);
            updatePercent('average-percent', data.percent_avg);
        })
        .catch(error => console.error('Error fetching real-time data:', error));
}


    
    // Fetch data every 5 seconds
    setInterval(fetchData, 5000);
    fetchData();  // Initial load