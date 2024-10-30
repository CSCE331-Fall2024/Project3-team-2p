<template>
    <div class="inventory-dashboard">
        <router-link :to="{ name: 'ManagerHome' }">
            <button>Go to Home</button>
        </router-link>
        <div class="table-container">
            <table class="inventory-table">
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Stock</th>
                        <th>Current Threshold</th>
                        <th>Price</th>
                        <th>Unit</th>
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

                        <td v-if="item.selected">
                            <input v-model.number="item.price" class="editable-input" type="number" />
                        </td>
                        <td v-else>{{ item.price }}</td>
                        
                        <td v-if="item.selected">
                            <input v-model="item.unit" class="editable-input" />
                        </td>
                        <td v-else>{{ item.unit }}</td>

                        <td><button @click="editIngredient(index)" class="action-button">{{ item.selected ? "Save" : "Select" }}</button></td>
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
                { name: "Chicken", stock: 10, threshold: 9, price: 0.02, unit: "g", selected: false },
                { name: "Noodles", stock: 12, threshold: 6, price: 0.02, unit: "g", selected: false },
                { name: "Chicken", stock: 10, threshold: 9, price: 0.02, unit: "g", selected: false },
                { name: "Noodles", stock: 12, threshold: 6, price: 0.02, unit: "g", selected: false },
                { name: "Chicken", stock: 10, threshold: 9, price: 0.02, unit: "g", selected: false },
                { name: "Noodles", stock: 12, threshold: 6, price: 0.02, unit: "g", selected: false },
                { name: "Chicken", stock: 10, threshold: 9, price: 0.02, unit: "g", selected: false },
                { name: "Noodles", stock: 12, threshold: 6, price: 0.02, unit: "g", selected: false },
                { name: "Chicken", stock: 10, threshold: 9, price: 0.02, unit: "g", selected: false },
                { name: "Noodles", stock: 12, threshold: 6, price: 0.02, unit: "g", selected: false },
                { name: "Chicken", stock: 10, threshold: 9, price: 0.02, unit: "g", selected: false },
                { name: "Noodles", stock: 12, threshold: 6, price: 0.02, unit: "g", selected: false },
                { name: "Chicken", stock: 10, threshold: 9, price: 0.02, unit: "g", selected: false },
                { name: "Noodles", stock: 12, threshold: 6, price: 0.02, unit: "g", selected: false },
                { name: "Chicken", stock: 10, threshold: 9, price: 0.02, unit: "g", selected: false },
                { name: "Noodles", stock: 12, threshold: 6, price: 0.02, unit: "g", selected: false },
                { name: "Chicken", stock: 10, threshold: 9, price: 0.02, unit: "g", selected: false },
                { name: "Noodles", stock: 12, threshold: 6, price: 0.02, unit: "g", selected: false },
                { name: "Chicken", stock: 10, threshold: 9, price: 0.02, unit: "g", selected: false },
                { name: "Noodles", stock: 12, threshold: 6, price: 0.02, unit: "g", selected: false },
                { name: "Chicken", stock: 10, threshold: 9, price: 0.02, unit: "g", selected: false },
                { name: "Noodles", stock: 12, threshold: 6, price: 0.02, unit: "g", selected: false },
                { name: "Chicken", stock: 10, threshold: 9, price: 0.02, unit: "g", selected: false },
                { name: "Noodles", stock: 12, threshold: 6, price: 0.02, unit: "g", selected: false },
                { name: "Chicken", stock: 10, threshold: 9, price: 0.02, unit: "g", selected: false },
                { name: "Noodles", stock: 12, threshold: 6, price: 0.02, unit: "g", selected: false },
                { name: "Chicken", stock: 10, threshold: 9, price: 0.02, unit: "g", selected: false },
                { name: "Noodles", stock: 12, threshold: 6, price: 0.02, unit: "g", selected: false },
                { name: "Chicken", stock: 10, threshold: 9, price: 0.02, unit: "g", selected: false },
                { name: "Noodles", stock: 12, threshold: 6, price: 0.02, unit: "g", selected: false },
                { name: "Chicken", stock: 10, threshold: 9, price: 0.02, unit: "g", selected: false },
                { name: "Noodles", stock: 12, threshold: 6, price: 0.02, unit: "g", selected: false },
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