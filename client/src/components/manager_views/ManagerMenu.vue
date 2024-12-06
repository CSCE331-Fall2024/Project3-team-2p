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

                        <td><button v-if="!(item.selected && showIngredientPanel)" @click="editMenuItem(index)" class="action-button">{{ item.selected ? "Save" :
                            "Select" }}</button>
                            <button v-if="item.selected" @click="editIngredients(index)" class="action-button">{{
                                this.showIngredientPanel ? "Save Ingredients" : "Ingredients" }}</button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <button @click="addMenuItem" class="action-button">Add Menu Item</button>
        </div>
        <div class="ingredient-panel" v-if="showIngredientPanel">
            <div class="menu-panel">
                <h1 class="title">{{ menuData[ingredientIndex].name }}</h1>
                <div class="button-container">
                    <div v-for="item in menuData[ingredientIndex].ingredients" :key="item.id" class="ingredient-box">
                        {{ item.name }}
                        <div class="row-container">
                            <input v-model.number="item.quantity" type="number" />
                            {{ item.unit }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
axios.defaults.baseURL = process.env.VUE_APP_BASE_URL;
export default {
    data() {
        return {
            //menuData: [],
            menuData: [
                {
                    id: 1,
                    name: "Orange Chicken",
                    entree: 1,
                    price: 0,
                    ingredients: [
                        {
                            id: 10,
                            name: "Orange Sauce",
                            quantity: 300,
                            unit: "ml",
                        },
                        {
                            id: 21,
                            name: "Chicken",
                            quantity: 100,
                            unit: "g",
                        }
                    ]
                },
            ],
            ingredientData: [],
            emptyIngredientList: [],
            maxId: 0,
            showIngredientPanel: false,
            ingredientIndex: 0,
            anyItemSelected: false,
        };
    },
    created() {
        //TODO: uncomment when api is complete
        //this.fetchMenu();
        this.fetchEmptyIngredientList();
    },
    methods: {
        async fetchEmptyIngredientList() {
            try {
                const response = await axios.get('/api/inventory/ingredients');
                this.emptyIngredientList = response.data.map(ingr => {
                    return { id: ingr.id, name: ingr.name, quantity: 0, unit: ingr.unit };
                });
                console.log('ingredient fetched:', this.emptyIngredientList);
            } catch (error) {
                console.error('Error fetching ingredients:', error);
            }
        },
        async fetchMenu() {
            try {
                const response = await axios.get('/api/inventory/menu-items');
                this.menuData = response.data;
                this.maxId = Math.max(0, ...this.menuData.map(item => item.id || 0));
                console.log('menuData fetched:', this.menuData);
            } catch (error) {
                console.error('Error fetching menuData:', error);
            }
        },
        async updateMenu() {
            try {
                /*console.log(this.menuData);

                console.log(menuItem.Name);
                const ingredientsMenuItems = {
                    [menuItem.id]: []
                };
                const response = await axios.post('/api/inventory/menu-items', { menuItems: [menuItem], ingredientsMenuItems });*/
                //console.log({ menuItems: [menuItem], ingredientsMenuItems });

                const response = await axios.post('/api/inventory/menu-items', {menuItems});

                console.log(response.data.message);
            } catch (error) {
                console.error('Error updating ingredients:', error);
            }
        },
        editMenuItem(index) {
            if (this.menuData[index].selected) {
                if (this.showIngredientPanel) {
                    alert("Please save your ingredients before saving the item")
                } else {
                    this.menuData[index].selected = false
                    this.anyItemSelected = false
                    //TODO: remove comment when api works
                    //this.updateMenu()
                }
            } else {
                if (this.anyItemSelected) {
                    alert("Please save your changes before editing a new item")
                } else {
                    this.menuData[index].selected = true
                    this.anyItemSelected = true
                }
            }
        },
        editEntreeBool(index) {
            this.menuData[index].entree = !this.menuData[index].entree;
        },
        addMenuItem() {
            if (this.anyItemSelected) {
                alert("Please save your changes before adding a new item")
            } else {
                this.anyItemSelected = true;
                this.maxId += 1;
                this.menuData.push({
                    "id": this.maxId, "name": "", "price": 0, "entree": true, "ingredients": this.emptyIngredientList, "selected": true
                });
            }
        },
        editIngredients(index) {
            if (this.showIngredientPanel) {
                //hide panel
                this.showIngredientPanel = false;
            } else {
                //set index
                this.ingredientIndex = index;
                // merge base ingredient list with specific ingredient list
                const subsetIds = new Set(this.menuData[index].ingredients.map(item => item.id));
                this.emptyIngredientList.forEach(item => {
                    if (!subsetIds.has(item.id)) {
                        this.menuData[index].ingredients.push({ ...item });
                    }
                });
                console.log("new ingredients:", this.menuData[index].ingredients);
                //show panel
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
    height: 90vh;
    width: 16vw;
    top: 5vh;
    left: 2vw;
    background-color: #273043;
    border-radius: 5px;
    overflow-y: scroll;
}

.menu-panel {
    padding: 10px;
    text-align: center;
}

.ingredient-box {
    width: 90%;
    background-color: #EFF6EE;
    color: black;
    padding: 10px 20px;
    margin: 5px;
    font-size: 16px;
    border: none;
    border-radius: 5px;
}

.button-container {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    justify-content: center;
    margin-top: 20px;
}
</style>