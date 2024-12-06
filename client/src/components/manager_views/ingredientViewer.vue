<template>
    <div class="menu-panel">
        <h1>{{ itemIndex }}</h1>
        <div class="button-container">
            <button v-for="item in inventoryData" :key="item.id" class="action-button">
                {{ item.name }}
            </button>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
axios.defaults.baseURL = process.env.VUE_APP_BASE_URL;
export default {
    props: {
        ingredientIndex: {
            type: Number,
            required: true,
        },
    },
    data() {
        //TODO: replace with data from api call
        return {
            /*inventoryData: [
                { name: "Chicken", stock: 10, threshold: 9, price: 0.02, unit: "g", selected: false },
                { name: "Noodles", stock: 12, threshold: 6, price: 0.02, unit: "g", selected: false },
            ],*/
            inventoryData: [],
            //maxId: 0,
        };
    },
    created() {
        this.fetchInventory();
    },
    methods: {
        async fetchInventory() {
            try {
                const response = await axios.get('/api/inventory/ingredients');
                this.inventoryData = response.data;
                //this.maxId = Math.max(0, ...this.inventoryData.map(item => item.id || 0));
                console.log('ingredient fetched:', this.inventoryData);
            } catch (error) {
                console.error('Error fetching ingredients:', error);
            }
        },
    }
};
</script>

<style>
.menu-panel {
    padding: 20px;
    text-align: center;
}

.button-container {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: center;
    margin-top: 20px;
}
</style>