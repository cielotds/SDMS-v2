function fetchData(timeframe) {
    return fetch(`/api/${timeframe}-sales-data`)  // Adjust the API endpoint as needed
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok for ${timeframe}`);
            }
            return response.json();
        });
}

function fetchSalesByProductData(timeframe) {
    return fetch(`/api/${timeframe}-sales-by-product`)  // Adjust the API endpoint as needed
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok for ${timeframe}`);
            }
            return response.json();
        });
}

function createChart(ctx, labels, values, label, type = 'line') {
    return new Chart(ctx, {
        type: type,
        data: {
            labels: labels,
            datasets: [{
                label: label,
                data: values,
                borderColor: type === 'pie' ? 'transparent' : getColor(label),
                backgroundColor: type === 'pie' ? getPastelColors(labels) : undefined,
                borderWidth: type === 'pie' ? 0 : undefined,
                fill: type === 'line' ? false : true,
                tension: type === 'line' ? 0.4 : undefined
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
}

function getColor(label) {
    const colors = {
        'Daily Sales': '#3b82f6',
        'Weekly Sales': '#f97316',
        'Monthly Sales': '#22c55e',
        'Yearly Sales': '#eab308'
    };
    return colors[label] || '#000000'; // Default color if label not found
}

function getPastelColors(labels) {
    const pastelColors = {
        'Siomai Rice': '#FFB3BA',
        'Chicken Finger Rice': '#FFDFBA',
        'Shanghai Rice': '#B2C2D6',
        'Fish Fillet Rice': '#BAE1FF',
        'Small Fries': '#C2F0C2',
        'Big Fries': '#D6E6B2',
        '16oz Fries & Juice': '#FFEBA1',
        '22oz Fries & Juice': '#FFABAB',
        '16oz Fries & Juice + 1pc Cheese Burger': '#FF677D',
        '22oz Fries & Juice + 1pc Cheese Burger': '#D4A5A5',
        'Burger': '#FFB3E6',
        'Burger w/ Cheese': '#C2B2D6',
    };
    return labels.map(label => pastelColors[label] || '#E0E0E0'); // Default pastel color if not found
}

function renderCharts() {
    const timeframes = ['daily', 'weekly', 'monthly', 'yearly'];
    const chartPromises = timeframes.map(timeframe => fetchData(timeframe));
    const salesByProductPromises = timeframes.map(timeframe => fetchSalesByProductData(timeframe));

    Promise.all(chartPromises)
        .then(dataArray => {
            // Create line charts for each timeframe
            dataArray.forEach((data, index) => {
                const ctx = document.getElementById(`${timeframes[index]}SalesChart`).getContext('2d');
                createChart(ctx, data.labels, data.values, `${timeframes[index].charAt(0).toUpperCase() + timeframes[index].slice(1)} Sales`);
            });

            // Now fetch and create pie charts for sales by product
            return Promise.all(salesByProductPromises);
        })
        .then(salesByProductDataArray => {
            // Create pie charts for each timeframe
            salesByProductDataArray.forEach((data, index) => {
                const ctx = document.getElementById(`${timeframes[index]}SalesByProductChart`).getContext('2d');
                createChart(ctx, data.labels, data.values, `${timeframes[index].charAt(0).toUpperCase() + timeframes[index].slice(1)} Sales by Product`, 'pie');
            });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            alert("An error occurred while fetching data.");
        });
}


// Fetch data for all timeframes on initial load
renderCharts();