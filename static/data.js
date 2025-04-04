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
                        element.textContent = (percentValue < 0 ? "-" : "+") + percentValue; 
                        element.className = percentValue >= 0 ? "text-green-700 mt-2" : "text-red-700 mt-2";
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