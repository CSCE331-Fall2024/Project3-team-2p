<template>
    <div class="inventory-dashboard">
        <router-link :to="{ name: 'ManagerHome' }">
            <button class="action-button">Go to Home</button>
        </router-link>
        <div class="table-container">
            <table class="inventory-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Entree</th>
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
                            <button @click="editEntreeBool(index)" class="action-button">{{ item.entree }}</button>
                        </td>
                        <td v-else>{{ item.entree }}</td>

                        <td><button @click="editMenuItem(index)" class="action-button">{{ item.selected ? "Save" :
                            "Select" }}</button></td>
                    </tr>
                </tbody>
            </table>
            <button @click="addMenuItem" class="action-button">Add Menu Item</button>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
axios.defaults.baseURL = process.env.VUE_APP_BASE_URL;
export default {
    data() {
        //TODO: replace with data from api call
        return {
            /*menuData: [
                { name: "Orange Chicken", price: 0, entree: true, selected: false },
                { name: "Beijing Beef", price: 0, entree: true, selected: false },
            ],*/
            menuData: [],
            maxId: 0,
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

                console.log(menuItem.Name)
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
                this.updateMenu(this.menuData[index])
            } else {
                this.menuData[index].selected = true
            }
        },
        editEntreeBool(index) {
            this.menuData[index].entree = !this.menuData[index].entree;
        },
        addMenuItem() {
            this.maxId += 1;
            this.menuData.push({ id: this.maxId, Name: "", "Aditional Cost": 0, Entree: true, selected: true });
        },
    }
};
</script>