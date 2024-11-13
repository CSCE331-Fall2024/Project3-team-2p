<template>
    <div>
        <h2>Ingredient Usage Over Time</h2>
        <canvas id="ingredient-usage-chart"></canvas>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import Chart from 'chart.js/auto';

export default {
    name: 'IngredientUsageChart',
    setup() {
        const chartRef = ref(null);

        const mockData = [
            { date: '2024-11-01', amount: 50 },
            { date: '2024-11-02', amount: 30 },
            { date: '2024-11-03', amount: 40 },
            { date: '2024-11-04', amount: 60 },
            { date: '2024-11-05', amount: 20 },
            { date: '2024-11-06', amount: 70 },
            { date: '2024-11-07', amount: 50 },
        ];

        onMounted(() => {
            const ctx = document.getElementById('ingredient-usage-chart').getContext('2d');
            chartRef.value = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: mockData.map(item => item.date),
                    datasets: [
                        {
                            label: 'Usage Amount',
                            data: mockData.map(item => item.amount),
                            borderColor: 'rgb(66, 165, 245)',
                            backgroundColor: 'rgba(66, 165, 245, 0.2)',
                            fill: true,
                            tension: 0.2,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top',
                            labels: {
                                color: 'white',
                            },
                        },
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Date',
                                color: 'white',
                            },
                            ticks: {
                                color: 'white',
                            },
                            grid: {
                                color: '#dddddd88',
                            },
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Usage Amount',
                                color: 'white',
                            },
                            ticks: {
                                color: 'white',
                            },
                            grid: {
                                color: '#dddddd88',
                            },
                            beginAtZero: true,
                        },
                    },
                },
            });
        });

        return {
            chartRef,
        };
    },
};
</script>

<style>
h2 {
    text-align: center;
    color: white;
}

canvas {
    display: block;
    margin: 20px;
}
</style>