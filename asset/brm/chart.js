document.addEventListener('DOMContentLoaded', function() {
    const data = {
        labels: ['BOBBY YUS HENDRA', 'ERVINA WIJAYA'],
        datasets: [{
            label: 'Pemegang Saham',
            data: [50, 50],
            backgroundColor: [
                'rgb(101, 224, 206)',  
                'rgb(255, 205, 86)'   
            ],
            borderColor: [
                'rgb(101, 224, 206)',
                'rgb(255, 205, 86)'
            ],
            hoverOffset: 4
        }]
    };

    const config = {
        type: 'pie',
        data: data,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',  // Position legend at the bottom of the chart
                    align: 'start',      // Align legend to the left (start)
                    labels: {
                        padding: 30,       // Add some padding between legend labels
                        usePointStyle: true, // Use point style for legend symbols
                        font: {
                            weight: 'bold' // Make legend labels bold
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            label += context.label + ' ' + Math.round(context.raw / context.chart.data.datasets[0].data.reduce((a, b) => a + b) * 100) + '%';
                            return label;
                        }
                    }
                }
            }
        }
    };

    const ctx = document.getElementById('myChart').getContext('2d');
    new Chart(ctx, config);
});
