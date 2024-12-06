<template>
    <div class="inventory-dashboard">
        <router-link :to="{ name: 'ManagerHome' }">
            <button class="action-button">Go to Home</button>
        </router-link>
        <router-link :to="{ name: 'customerView' }">
            <button class="action-button">Logout</button>
        </router-link>
        <div class="table-container">
            <table class="inventory-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Upcharge</th>
                        <th>Type</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in menuData" :key="index" :class="{ selected: item.selected }">
                        <td v-if="item.selected">
                            <input v-model="item.name" class="editable-input" />
                        </td>
                        <td v-else>{{ item.name }}</td>

                        <td v-if="item.selected">
                            <input v-model.number="item.price" class="editable-input" type="number" />
                        </td>
                        <td v-else>{{ item.price }}</td>

                        <td v-if="item.selected">
                            <button @click="editEntreeBool(index)" class="action-button">{{ item.entree ? "Entree" :
                                "Side" }}</button>
                        </td>
                        <td v-else>{{ item.entree ? "Entree" : "Side" }}</td>

                        <td><button @click="editMenuItem(index)" class="action-button">{{ item.selected ? "Save" :
                            "Select" }}</button>
                            <button v-if="item.selected" @click="editIngredients(index)" class="action-button">{{
                                this.showIngredientPanel ? "Save Ingredients" : "Ingredients"}}</button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <button @click="addMenuItem" class="action-button">Add Menu Item</button>
        </div>
        <div class="ingredient-panel" v-if="showIngredientPanel">
            <ingredient-viewer :index=ingredientIndex></ingredient-viewer>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import IngredientViewer from './ingredientViewer.vue';
axios.defaults.baseURL = process.env.VUE_APP_BASE_URL;
export default {
    components: {
        IngredientViewer,
    },
    data() {
        //TODO: replace with data from api call
        return {
            /*menuData: [
                { name: "Orange Chicken", price: 0, entree: true, selected: false },
                { name: "Beijing Beef", price: 0, entree: true, selected: false },
            ],*/
            menuData: [],
            maxId: 0,
            showIngredientPanel: false,
            ingredientIndex: 1,
            anyItemSelected: false,
        };
    },
    created() {
        this.fetchMenu();
    },
    methods: {
        async fetchMenu() {
            try {
                const response = await axios.get('/api/inventory/menu-items');
                this.menuData = response.data;
                //this.maxId = Math.max(0, ...this.menuData.map(item => item.id || 0));
                console.log('menuData fetched:', this.menuData);
            } catch (error) {
                console.error('Error fetching menuData:', error);
            }
        },
        async updateMenu(menuItem) {
            try {
                /*const ingredientsMenuItems = menuItem.reduce((obj, item) => {
                    obj[item.id] = [];
                    return obj;
                }, {});*/
                console.log(this.menuData);

                console.log(menuItem.Name);
                const ingredientsMenuItems = {
                    [menuItem.id]: []
                };
                const response = await axios.post('/api/inventory/menu-items', { menuItems: [menuItem], ingredientsMenuItems });
                //console.log({ menuItems: [menuItem], ingredientsMenuItems });

                console.log(response.data.message);
            } catch (error) {
                console.error('Error updating ingredients:', error);
            }
        },
        editMenuItem(index) {
            if (this.menuData[index].selected) {
                this.menuData[index].selected = false
                this.anyItemSelected = false
                this.updateMenu(this.menuData[index])
            } else {
                if(this.anyItemSelected){
                    alert("Please save your changes before editing a new item")
                } else {
                    this.menuData[index].selected = true
                    this.anyItemSelected = true
                }
            }
        },
        editEntreeBool(index) {
            this.menuData[index].entree = !this.menuData[index].entree;
            this.updateMenu(this.menuData[index]);
        },
        addMenuItem() {
            this.maxId += 1;
            this.menuData.push({ id: this.maxId, Name: "", "Aditional Cost": 0, Entree: true, selected: true });
        },
        editIngredients(index) {
            index = index;
            if(this.showIngredientPanel) {
                //save ingredients
                this.showIngredientPanel = false;
                this.updateMenu(this.menuData[index])
            } else {
                //edit ingredients
                this.ingredientIndex = index;
                this.showIngredientPanel = true;
            }
        },
    }
};
</script>

<style>
.ingredient-panel {
    z-index: 20;
    position: fixed;
    height: 50vh;
    width: 100vw;
    bottom: 0%;
    left: 0%;
    background-color: #949292;
}
</style>