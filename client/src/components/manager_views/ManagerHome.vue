<template>
    <div class="main-page">
        <h1 class="title">Manager Dashboard</h1>
        <div v-if="weather" class="weather-container">
            <p>Current Weather in {{ city }}, {{ region }}</p>
            <p>{{ weather.weather[0].description }} - {{ weather.main.temp }}°C</p>
        </div>
        <div class="table-container">
            <IngredientUsageChart />
        </div>
        <router-link :to="{ name: 'ManagerMenu' }">
            <button class="action-button">Go to Menu</button>
        </router-link>
        <router-link :to="{ name: 'ManagerInventory' }">
            <button class="action-button">Go to Inventory</button>
        </router-link>
        <router-link :to="{ name: 'ManagerEmployees' }">
            <button class="action-button">Go to Employees</button>
        </router-link>
        <router-link :to="{ name: 'customerView' }">
            <button class="action-button">Logout</button>
        </router-link>
    </div>
    <router-view></router-view>
</template>

<script>
import IngredientUsageChart from './usageChart.vue';
import axios from 'axios';

export default {
    name: 'ManagerHome',
    components: {
        IngredientUsageChart,
    },
    data() {
        return {
            city: null,
            region: null,
            weather: null,
        };
    },
    mounted() {
        this.fetchWeather();
    },
    methods: {
        async fetchWeather() {
            try {
                const locationResponse = await axios.get('https://ipapi.co/json/');
                const { latitude, longitude, city, region } = locationResponse.data;
                this.city = city;
                this.region = region;

                const apiKey = process.env.VUE_APP_OPENWEATHER_API_KEY;
                //console.log('api key: ', apiKey);
                const weatherResponse = await axios.get(
                    `https://api.openweathermap.org/data/2.5/weather`,
                    {
                        params: {
                            lat: latitude,
                            lon: longitude,
                            appid: apiKey,
                            units: 'imperial',
                        },
                    }
                );

                this.weather = weatherResponse.data;
            } catch (error) {
                console.error('Error fetching weather data:', error);
            }
        },
    },
};
</script>


<style>
.template {
    width: 100%;
    height: 100%;
}

.title {
    color: #EFF6EE;
}

.inventory-dashboard,
.main-page {
    background-color: #F02D3A;
    padding: 20px;
    text-align: center;
    min-height: 100vh;
}

.inventory-table {
    width: 100%;
    margin: auto;
    background-color: #273043;
    color: white;
    border-collapse: collapse;
}

.inventory-table th,
.inventory-table td {
    padding: 10px;
    border: 1px solid #555;
    max-width: 0px;
    white-space: nowrap;
    overflow: hidden;
}

.table-container {
    max-height: 75vh;
    max-width: 60vw;
    overflow-y: auto;
    margin: auto;
    background-color: #273043;
    border-radius: 5px;
}

.button-group {
    margin-top: 20px;
}

.action-button {
    background-color: #EFF6EE;
    color: black;
    padding: 10px 20px;
    margin: 5px;
    font-size: 16px;
    border: none;
    cursor: pointer;
    border-radius: 5px;
}

.action-button:hover {
    background-color: #EFF6EEBB;
}

.selected {
    background-color: #666;
}

.editable-input {
    width: 100%;
    box-sizing: border-box;
}

.weather-container {
    z-index: 10;
    position: absolute;
    background-color: #273043;
    color: white;
    padding: 10px;
    border-radius: 5px;
    margin: 20px auto;
    max-width: 15vw;
    text-align: center;
}
</style>