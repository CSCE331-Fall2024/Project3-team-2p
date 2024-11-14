<template>
    <div>
        <h2>Ingredient Usage Over Time</h2>
        <div class="graph-div">
            <canvas id="ingredient-usage-chart"></canvas>
            <div class="selection-div">
                <div class="date-selectors">
                    <label>Start Date:</label>
                    <input class="selection-element" type="date" v-model="startDate" @change="fetchUsageData">
                    <label>End Date:</label>
                    <input class="selection-element" type="date" v-model="endDate" @change="fetchUsageData">
                </div>
                <select v-model="selectedIngredient" @change="fetchUsageData">
                    <option v-for="ingredient in ingredients" :key="ingredient.id" :value="ingredient">
                        {{ ingredient.name }}
                    </option>
                </select>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import Chart from 'chart.js/auto';
import axios from 'axios';

export default {
    name: 'IngredientUsageChart',
    setup() {
        const chartRef = ref(null);
        const selectedIngredient = ref(null);
        const startDate = ref('');
        const endDate = ref('');
        const ingredients = ref([]);
        const chartData = ref({
            labels: [],
            datasets: [
                {
                    label: 'Usage Amount',
                    data: [],
                    borderColor: 'rgb(66, 165, 245)',
                    backgroundColor: 'rgba(66, 165, 245, 0.2)',
                    fill: true,
                    tension: 0.2,
                },
            ],
        });

        const setDefaultDates = () => {
            const today = new Date();
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(today.getDate() - 7);

            startDate.value = sevenDaysAgo.toISOString().split('T')[0];
            endDate.value = today.toISOString().split('T')[0];
        };

        const fetchIngredients = async () => {
            try {
                const response = await axios.get('/api/inventory/ingredients');
                ingredients.value = response.data;
                selectedIngredient.value = ingredients.value[0] || null;
                fetchUsageData();
            } catch (error) {
                console.error('Failed to fetch ingredients:', error);
            }
        };

        const fetchUsageData = async () => {
            if (!selectedIngredient.value) return;

            try {
                const response = await axios.get('/api/analytics/ingredient-usage', {
                    params: {
                        id: selectedIngredient.value.id,
                        startDate: startDate.value,
                        endDate: endDate.value,
                    },
                });

                const usageData = response.data;

                console.log(usageData);
                chartData.value.labels = usageData.map(item => new Date(item.date).toISOString().split('T')[0]);
                chartData.value.datasets[0].data = usageData.map(item => item.amount);
                updateChart();
            } catch (error) {
                console.error('Failed to fetch usage data:', error);
            }
        };

        const updateChart = () => {
            if (chartRef.value) {
                chartRef.value.destroy();
            }

            const ctx = document.getElementById('ingredient-usage-chart').getContext('2d');
            chartRef.value = new Chart(ctx, {
                type: 'line',
                data: chartData.value,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
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
        };


        onMounted(() => {
            fetchIngredients();
            setDefaultDates();
        });

        window.addEventListener('resize', () => {
            if (chartRef.value) {
                chartRef.value.resize();
            }
        });

        return {
            chartRef,
            ingredients,
            selectedIngredient,
            startDate,
            endDate,
            fetchUsageData,
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