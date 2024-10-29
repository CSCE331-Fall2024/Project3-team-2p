<template>
    <div class="inventory-dashboard">
        <div class="table-container">
            <table class="inventory-table">
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Stock</th>
                        <th>Current Threshold</th>
                        <th>Moving Avg. Change</th>
                        <th>Suggestion</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in inventoryData" :key="index">
                        <td>{{ item.name }}</td>
                        <td>{{ item.stock }}</td>
                        <td>{{ item.threshold }}</td>
                        <td>{{ item.change }}%</td>
                        <td>{{ item.suggestion }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="button-group">
            <button @click="editThresholds" class="action-button">Edit Thresholds</button>
            <button @click="orderIngredients" class="action-button">Order Ingredients</button>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        //TODO: replace with data from api call
        return {
            inventoryData: [
                { name: "Chicken", stock: 10, threshold: 9, change: 33.3, suggestion: "Increase the threshold to 12" },
                { name: "Noodles", stock: 12, threshold: 6, change: -1.32, suggestion: "Everything looks good" },
                { name: "Chicken", stock: 10, threshold: 9, change: 33.3, suggestion: "Increase the threshold to 12" },
                { name: "Noodles", stock: 12, threshold: 6, change: -1.32, suggestion: "Everything looks good" },
                { name: "Chicken", stock: 10, threshold: 9, change: 33.3, suggestion: "Increase the threshold to 12" },
                { name: "Noodles", stock: 12, threshold: 6, change: -1.32, suggestion: "Everything looks good" },
                { name: "Chicken", stock: 10, threshold: 9, change: 33.3, suggestion: "Increase the threshold to 12" },
                { name: "Noodles", stock: 12, threshold: 6, change: -1.32, suggestion: "Everything looks good" },
                { name: "Chicken", stock: 10, threshold: 9, change: 33.3, suggestion: "Increase the threshold to 12" },
                { name: "Noodles", stock: 12, threshold: 6, change: -1.32, suggestion: "Everything looks good" },
                { name: "Chicken", stock: 10, threshold: 9, change: 33.3, suggestion: "Increase the threshold to 12" },
                { name: "Noodles", stock: 12, threshold: 6, change: -1.32, suggestion: "Everything looks good" },
                { name: "Chicken", stock: 10, threshold: 9, change: 33.3, suggestion: "Increase the threshold to 12" },
                { name: "Noodles", stock: 12, threshold: 6, change: -1.32, suggestion: "Everything looks good" },
                { name: "Chicken", stock: 10, threshold: 9, change: 33.3, suggestion: "Increase the threshold to 12" },
                { name: "Noodles", stock: 12, threshold: 6, change: -1.32, suggestion: "Everything looks good" },
                { name: "Chicken", stock: 10, threshold: 9, change: 33.3, suggestion: "Increase the threshold to 12" },
                { name: "Noodles", stock: 12, threshold: 6, change: -1.32, suggestion: "Everything looks good" },
                { name: "Chicken", stock: 10, threshold: 9, change: 33.3, suggestion: "Increase the threshold to 12" },
                { name: "Noodles", stock: 12, threshold: 6, change: -1.32, suggestion: "Everything looks good" },
                { name: "Chicken", stock: 10, threshold: 9, change: 33.3, suggestion: "Increase the threshold to 12" },
                { name: "Noodles", stock: 12, threshold: 6, change: -1.32, suggestion: "Everything looks good" },
                { name: "Chicken", stock: 10, threshold: 9, change: 33.3, suggestion: "Increase the threshold to 12" },
                { name: "Noodles", stock: 12, threshold: 6, change: -1.32, suggestion: "Everything looks good" },
                { name: "Chicken", stock: 10, threshold: 9, change: 33.3, suggestion: "Increase the threshold to 12" },
                { name: "Noodles", stock: 12, threshold: 6, change: -1.32, suggestion: "Everything looks good" },
                { name: "Chicken", stock: 10, threshold: 9, change: 33.3, suggestion: "Increase the threshold to 12" },
                { name: "Noodles", stock: 12, threshold: 6, change: -1.32, suggestion: "Everything looks good" },
                { name: "Chicken", stock: 10, threshold: 9, change: 33.3, suggestion: "Increase the threshold to 12" },
                { name: "Noodles", stock: 12, threshold: 6, change: -1.32, suggestion: "Everything looks good" },
                { name: "Chicken", stock: 10, threshold: 9, change: 33.3, suggestion: "Increase the threshold to 12" },
                { name: "Noodles", stock: 12, threshold: 6, change: -1.32, suggestion: "Everything looks good" },
            ],
        };
    },
    methods: {
        editThresholds() {
            console.log("Edit thresholds function called");
            //TODO: replace with api call 
        },
        orderIngredients() {
            console.log("Order ingredients function called");
            //TODO: replace with api call 
        }
    }
};
</script>

<style scoped>
.template {
    width: 100%;
    height: 100%;
}

.inventory-dashboard {
    background-color: #cc3333;
    padding: 20px;
    text-align: center;
    min-height: 100vh;
}

.inventory-table {
    width: 100%;
    margin: auto;
    background-color: #333;
    color: white;
    border-collapse: collapse;
}

.inventory-table th,
.inventory-table td {
    padding: 10px;
    border: 1px solid #555;
}

.table-container {
    max-height: 75vh;
    max-width: 60vw;
    overflow-y: auto;
    margin: auto;
    background-color: #333;
}

.button-group {
    margin-top: 20px;
}

.action-button {
    background-color: white;
    color: black;
    padding: 10px 20px;
    margin: 5px;
    font-size: 16px;
    border: none;
    cursor: pointer;
    border-radius: 5px;
}

.action-button:hover {
    background-color: #f1f1f1;
}
</style>