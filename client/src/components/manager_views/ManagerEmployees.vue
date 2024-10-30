<template>
    <div class="inventory-dashboard">
        <router-link :to="{ name: 'ManagerHome' }">
            <button>Go to Home</button>
        </router-link>
        <div class="table-container">
            <table class="inventory-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>PIN</th>
                        <th>Manager</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in employeeData" :key="index" :class="{ selected: item.selected }">
                        <td>{{ item.id }}</td>

                        <td v-if="item.selected">
                            <input v-model="item.username" class="editable-input" />
                        </td>
                        <td v-else>{{ item.username }}</td>

                        <td v-if="item.selected">
                            <input v-model.number="item.pin" class="editable-input" type="number" />
                        </td>
                        <td v-else>{{ item.pin }}</td>

                        <td v-if="item.selected">
                            <button @click="editManagerBool(index)" class="action-button">{{ item.manager }}</button>
                        </td>
                        <td v-else>{{ item.manager }}</td>

                        <td><button @click="editEmployee(index)" class="action-button">{{ item.selected ? "Save" :
                            "Select" }}</button></td>
                    </tr>
                </tbody>
            </table>
            <button @click="addEmployee" class="action-button">Add Employee</button>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
axios.defaults.baseURL = process.env.VUE_APP_BASE_URL;;
export default {
    data() {
        //TODO: replace with data from api call
        return {
            /*employeeData: [
                { id: 1, username: "Zophous", pin: 1111, manager: true, selected: false },
                { id: 2, username: "Fishy", pin: 2222, manager: false, selected: false },
                { id: 3, username: "Timtak", pin: 3333, manager: false, selected: false },
                { id: 4, username: "Smiles", pin: 4444, manager: false, selected: false },
            ],*/
            employeeData: [],
            maxId: 0,
        };
    },
    created() {
        this.fetchEmployees();
    },
    methods: {
        async fetchEmployees() {
            try {
                const response = await axios.get('/api/inventory/employees');
                this.employeeData = response.data;
                console.log('employeeData fetched:', this.employeeData);
            } catch (error) {
                console.error('Error fetching employeeData:', error);
            }
        },
        async updateEmployee(employee) {
            try {
                const response = await axios.post('/api/inventory/employees', {employees: [employee]});
                console.log(response.data.message);
            } catch (error) {
                console.error('Error updating employee:', error);
            }
        },
        editEmployee(index) {
            if (this.employeeData[index].selected) {
                this.employeeData[index].selected = false
                //TODO: API call to send to backend
                this.updateEmployee(this.employeeData[index])
                //this.fetchEmployees()
            }else{
                this.employeeData[index].selected = true
            }
        },
        editManagerBool(index) {
            this.employeeData[index].manager = !this.employeeData[index].manager
        },
        addEmployee() {
            this.maxId = Math.max(...this.employeeData.map(employee => employee.id));
            this.employeeData.push({ id: this.maxId + 1, username: "", pin: 0, manager: false, selected: true });
        },
    }
};
</script>