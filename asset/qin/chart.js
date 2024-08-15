document.addEventListener('DOMContentLoaded', function() {
    const data = {
        labels: ['PT GLOBAL ENERGI LESTARI', 'ISRAQ SUCI LESTARI', 'FENNY FARADILLA NS'],
        datasets: [{
            label: 'Pemegang Saham',
            data: [50, 48,  1],
            backgroundColor: [
                'rgb(101, 224, 206)',
                'rgb(2, 79, 9)',   
                'rgb(142, 220, 167)'   
            ],
            borderColor: [
                'rgb(101, 224, 206)',
                'rgb(2, 79, 9)', 
                'rgb(142, 220, 167)'
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
