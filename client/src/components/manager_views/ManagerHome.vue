<template>
    <div class="main-page">
        <h1 class="title">Manager Dashboard</h1>
        <div class="table-container">
            <IngredientUsageChart/>
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
export default {
    name: 'ManagerHome',
    components: {
        IngredientUsageChart,
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
</style>