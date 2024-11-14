<template>
    <div>
        <h2>Ingredient Usage Over Time</h2>
        <div class="graph-div">
            <canvas id="ingredient-usage-chart"></canvas>
            <div class="selection-div">
                <div class="date-selectors">
                    <label>Start Date:</label>
                    <input class="selection-element" type="date" v-model="startDate" @change="updateChart">
                    <label>End Date:</label>
                    <input class="selection-element" type="date" v-model="endDate" @change="updateChart">
                </div>
                <select v-model="selectedIngredient">
                    <option v-for="ingredient in ingredients" :key="ingredient.id" :value="ingredient.name">
                        {{ ingredient.name }}
                    </option>
                </select>
                <button class="send-button">Send</button>
            </div>
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
        const startDate = ref('');
        const endDate = ref('');

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
                    maintainAspectRatio: false, // This allows the chart to resize correctly
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

            window.addEventListener('resize', () => {
                chartRef.value.resize();
            });
        });

        return {
            chartRef,
            ingredients,
            selectedIngredient,
            startDate,
            endDate,
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
    max-width: 80%;
}

select {
    margin: auto;
}

.selection-div {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 20%;
    margin: auto;
}

.date-selectors {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-bottom: 20px;
    color: white;
    gap: 10px;
}

.selection-element {
    max-width: 90%;
}

.graph-div {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    width: 100%;
}

.send-button {
    background-color: white;
    color: black;
    padding: 10px 20px;
    margin: 5px;
    font-size: 16px;
    border: none;
    cursor: pointer;
    border-radius: 5px;
}

.send-button:hover {
    background-color: #f1f1f1;
}
</style>