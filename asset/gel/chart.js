document.addEventListener('DOMContentLoaded', function() {
    const data = {
        labels: ['LUHENDRI', 'JOHNSON HARTAWAN'],
        datasets: [{
            label: 'Pemegang Saham',
            data: [80, 20],
            backgroundColor: [
                'rgb(255, 157, 30)',  // Orange color for LUHENDRI
                'rgb(255, 205, 86)'   // Light yellow color for JOHNSON HARTAWAN
            ],
            borderColor: [
                'rgb(255, 157, 30)',
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
