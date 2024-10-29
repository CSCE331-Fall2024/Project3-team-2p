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
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in inventoryData" :key="index" :class="{ selected: item.selected }">
                        <td v-if="item.selected">
                            <input v-model="item.name" class="editable-input" />
                        </td>
                        <td v-else>{{ item.name }}</td>

                        <td v-if="item.selected">
                            <input v-model.number="item.stock" class="editable-input" type="number" />
                        </td>
                        <td v-else>{{ item.stock }}</td>

                        <td v-if="item.selected">
                            <input v-model.number="item.threshold" class="editable-input" type="number" />
                        </td>
                        <td v-else>{{ item.threshold }}</td>
                        <td>{{ item.change }}%</td>
                        <td><button @click="editIngredient(index)" class="action-button">{{item.selected ? "Save" : "Select"}}</button></td>
                    </tr>
                </tbody>
            </table>
            <button @click="addIngredient" class="action-button">Add Ingredient</button>
        </div>

        <div class="button-group">
            <button @click="orderIngredients" class="action-button">Order Ingredients</button>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        //TODO: replace with data from api call
        return{
            inventoryData: [
                { name: "Chicken", stock: 10, threshold: 9, change: 33.3, selected: false },
                { name: "Noodles", stock: 12, threshold: 6, change: -1.32, selected: false },
                { name: "Chicken", stock: 10, threshold: 9, change: 33.3, selected: false },
                { name: "Noodles", stock: 12, threshold: 6, change: -1.32, selected: false },
                { name: "Chicken", stock: 10, threshold: 9, change: 33.3, selected: false },
                { name: "Noodles", stock: 12, threshold: 6, change: -1.32, selected: false },
                { name: "Chicken", stock: 10, threshold: 9, change: 33.3, selected: false },
                { name: "Noodles", stock: 12, threshold: 6, change: -1.32, selected: false },
                { name: "Chicken", stock: 10, threshold: 9, change: 33.3, selected: false },
                { name: "Noodles", stock: 12, threshold: 6, change: -1.32, selected: false },
                { name: "Chicken", stock: 10, threshold: 9, change: 33.3, selected: false },
                { name: "Noodles", stock: 12, threshold: 6, change: -1.32, selected: false },
                { name: "Chicken", stock: 10, threshold: 9, change: 33.3, selected: false },
                { name: "Noodles", stock: 12, threshold: 6, change: -1.32, selected: false },
                { name: "Chicken", stock: 10, threshold: 9, change: 33.3, selected: false },
                { name: "Noodles", stock: 12, threshold: 6, change: -1.32, selected: false },
                { name: "Chicken", stock: 10, threshold: 9, change: 33.3, selected: false },
                { name: "Noodles", stock: 12, threshold: 6, change: -1.32, selected: false },
                { name: "Chicken", stock: 10, threshold: 9, change: 33.3, selected: false },
                { name: "Noodles", stock: 12, threshold: 6, change: -1.32, selected: false },
                { name: "Chicken", stock: 10, threshold: 9, change: 33.3, selected: false },
                { name: "Noodles", stock: 12, threshold: 6, change: -1.32, selected: false },
                { name: "Chicken", stock: 10, threshold: 9, change: 33.3, selected: false },
                { name: "Noodles", stock: 12, threshold: 6, change: -1.32, selected: false },
                { name: "Chicken", stock: 10, threshold: 9, change: 33.3, selected: false },
                { name: "Noodles", stock: 12, threshold: 6, change: -1.32, selected: false },
                { name: "Chicken", stock: 10, threshold: 9, change: 33.3, selected: false },
                { name: "Noodles", stock: 12, threshold: 6, change: -1.32, selected: false },
                { name: "Chicken", stock: 10, threshold: 9, change: 33.3, selected: false },
                { name: "Noodles", stock: 12, threshold: 6, change: -1.32, selected: false },
                { name: "Chicken", stock: 10, threshold: 9, change: 33.3, selected: false },
                { name: "Noodles", stock: 12, threshold: 6, change: -1.32, selected: false },
            ],
        };
    },
    methods: {
        editIngredient(index){
            this.inventoryData[index].selected = !this.inventoryData[index].selected;
            if(this.inventoryData[index].selected){
                //TODO: API call to send to backend
            }
        },
        addIngredient(){
            this.inventoryData.push({name: "", stock: 0, threshold: 0, change: 0, selected: true});
        },
        orderIngredients(){
            console.log("Order ingredients function called");
            //TODO Matthew: go through and record how many of each ingredient will be ordered.
            //TODO: API call to update inventory 
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
    max-width: 0px;
    white-space: nowrap;
    overflow: hidden;
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

.selected {
    background-color: #666;
}

.editable-input {
    width: 100%;
    box-sizing: border-box;
}
</style>