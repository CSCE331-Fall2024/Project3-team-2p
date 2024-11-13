<template>
    <div>
        <h2>Ingredient Usage Over Time</h2>
        <div class="graph-div">
            <canvas id="ingredient-usage-chart"></canvas>
            <select v-model="selectedIngredient" size="10">
                <option v-for="ingredient in ingredients" :key="ingredient.id" :value="ingredient.name">
                    {{ ingredient.name }}
                </option>
            </select>
        </div>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import Chart from 'chart.js/auto';

export default {
    name: 'IngredientUsageChart',
    setup() {
        const chartRef = ref(null);
        const selectedIngredient = ref('');

        const ingredients = ref([
            { id: 1, name: 'Chicken' },
            { id: 2, name: 'Beef' },
            { id: 3, name: 'Rice' },
            { id: 4, name: 'Shrimp' },
            { id: 1, name: 'Chicken' },
            { id: 2, name: 'Beef' },
            { id: 3, name: 'Rice' },
            { id: 4, name: 'Shrimp' },
            { id: 1, name: 'Chicken' },
            { id: 2, name: 'Beef' },
            { id: 3, name: 'Rice' },
            { id: 4, name: 'Shrimp' },
            { id: 1, name: 'Chicken' },
            { id: 2, name: 'Beef' },
            { id: 3, name: 'Rice' },
            { id: 4, name: 'Shrimp' },
            { id: 1, name: 'Chicken' },
            { id: 2, name: 'Beef' },
            { id: 3, name: 'Rice' },
            { id: 4, name: 'Shrimp' },
            { id: 1, name: 'Chicken' },
            { id: 2, name: 'Beef' },
            { id: 3, name: 'Rice' },
            { id: 4, name: 'Shrimp' },
            { id: 1, name: 'Chicken' },
            { id: 2, name: 'Beef' },
            { id: 3, name: 'Rice' },
            { id: 4, name: 'Shrimp' },
            { id: 1, name: 'Chicken' },
            { id: 2, name: 'Beef' },
            { id: 3, name: 'Rice' },
            { id: 4, name: 'Shrimp' },
        ]);

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
            selectedIngredient.value = ingredients.value[0].name;
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
            ingredients,
            selectedIngredient,
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
    flex-grow: 1;
    max-width: 88%;
}

select {
    width: 10%;
    margin: auto;
}

.graph-div {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    width: 100%;
}
</style>