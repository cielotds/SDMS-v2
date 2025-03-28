//Function to fetch data from the database (Real-time data)
function fetchData() {
        fetch('/api/realtime')
        .then(response => response.json())
        .then(data => {
            document.getElementById('today-total').textContent = data.today;
            document.getElementById('yesterday-total').textContent = data.yesterday;
            document.getElementById('average-total').textContent = data.average;
            

            
            document.getElementById('today-percent').textContent = data.percent_today.includes('-') ? 
                    data.percent_today : `+${data.percent_today}`;
            document.getElementById('average-percent').textContent = data.percent_avg.includes('-') ? 
                    data.percent_avg : `+${data.percent_avg}`;

                    todayPercentElement.style.color = data.percent_today.includes('-') ? 'red' : 'green';
                    averagePercentElement.style.color = data.percent_avg.includes('-') ? 'red' : 'green';
        })
        .catch(error => console.error('Error fetching real-time data:', error));
    }

    // Fetch data every 5 seconds
    setInterval(fetchData, 5000);
    fetchData();  // Initial load

