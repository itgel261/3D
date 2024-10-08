document.addEventListener('DOMContentLoaded', function() {
    const data = {
        labels: ['LUHENDRI', 'ROSSY ELVINA'],
        datasets: [{
            label: 'Pemegang Saham',
            data: [65, 35],
            backgroundColor: [
                'rgb(218, 9, 83)',  // Orange color for LUHENDRI
                'rgb(237, 80, 135)'   // Light yellow color for JOHNSON HARTAWAN
            ],
            borderColor: [
                'rgb(218, 9, 83)',
                'rgb(237, 80, 135)'
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
