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
axios.defaults.baseURL = process.env.VUE_APP_BASE_URL;
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
            anySelected: false,
            maxId: 0,
        };
    },
    created() {
        this.fetchEmployees();
    },
    methods: {
        /**
         * Fetches employee data from the backend API and populates the employeeData array.
         */
         async fetchEmployees() {
            try {
                const response = await axios.get('/api/inventory/employees');
                this.employeeData = response.data;
                console.log('employeeData fetched:', this.employeeData);
            } catch (error) {
                console.error('Error fetching employeeData:', error);
            }
        },

        /**
         * Sends updated employee data to the backend API.
         * @param {Object} employee - The employee object to be updated.
         */
        async updateEmployee(employee) {
            try {
                const response = await axios.post('/api/inventory/employees', { employees: [employee] });
                console.log(response.data.message);
            } catch (error) {
                console.error('Error updating employee:', error);
            }
        },

        /**
         * Toggles the edit mode for an employee. If changes are saved, sends the updated data to the backend.
         * @param {number} index - The index of the employee in the employeeData array.
         */
        editEmployee(index) {
            if (this.employeeData[index].selected) {
                // Save changes and exit edit mode.
                this.employeeData[index].selected = false;
                this.anySelected = false;
                this.updateEmployee(this.employeeData[index]); // Send updated data to the backend.
            } else {
                if (this.anySelected) {
                    alert("Please save your changes first");
                } else {
                    // Enter edit mode for the selected employee.
                    this.employeeData[index].selected = true;
                    this.anySelected = true;
                }
            }
        },

        /**
         * Toggles the manager status (true/false) of an employee.
         * @param {number} index - The index of the employee in the employeeData array.
         */
        editManagerBool(index) {
            this.employeeData[index].manager = !this.employeeData[index].manager;
        },

        /**
         * Adds a new employee to the employeeData array in edit mode. Prevents adding if any employee is already being edited.
         */
        addEmployee() {
            if (this.anySelected) {
                alert("Please save your changes before adding a new employee");
            } else {
                // Calculate the new ID and add a new employee object.
                this.maxId = Math.max(...this.employeeData.map(employee => employee.id));
                this.employeeData.push({ id: this.maxId + 1, username: "", pin: 0, manager: false, selected: true });
                this.anySelected = true;
            }
        },
    }
};
</script>