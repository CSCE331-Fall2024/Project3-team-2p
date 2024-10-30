<template>
    <div class="inventory-dashboard">
        <router-link :to="{ name: 'ManagerHome' }">
            <button>Go to Home</button>
        </router-link>
        <div class="table-container">
            <table class="inventory-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Manager</th>
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
export default {
    data() {
        //TODO: replace with data from api call
        return {
            menuData: [
                { name: "Orange Chicken", price: 0, entree: true, selected: false },
                { name: "Beijing Beef", price: 0, entree: true, selected: false },
            ],
        };
    },
    methods: {
        editMenuItem(index) {
            this.menuData[index].selected = !this.menuData[index].selected;
            if (this.menuData[index].selected) {
                //TODO: API call to send to backend
            }
        },
        editEntreeBool(index) {
            this.menuData[index].entree = !this.menuData[index].entree;
        },
        addMenuItem() {
            this.menuData.push({ name: "", price: 0, entree: true, selected: true });
        },
    }
};
</script>