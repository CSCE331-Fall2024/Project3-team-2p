<template>
    <div class="inventory-dashboard">
        <div class="table-container">
            <table class="inventory-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>PIN Threshold</th>
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

                        <td><button @click="editEmployee(index)" class="action-button">{{item.selected ? "Save" : "Select"}}</button></td>
                    </tr>
                </tbody>
            </table>
            <button @click="addEmployee" class="action-button">Add Employee</button>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        //TODO: replace with data from api call
        return{
            employeeData: [
                { id: 1, username: "Zophous", pin: 1111, manager: true, selected: false },
                { id: 2, username: "Fishy", pin: 2222, manager: false, selected: false },
                { id: 3, username: "Timtak", pin: 3333, manager: false, selected: false },
                { id: 4, username: "Smiles", pin: 4444, manager: false, selected: false },
            ],
        };
    },
    methods: {
        editEmployee(index){
            this.employeeData[index].selected = !this.employeeData[index].selected;
            if(this.employeeData[index].selected){
                //TODO: API call to send to backend
            }
        },
        editManagerBool(index){
            this.employeeData[index].manager = !this.employeeData[index].manager;
        },
        addEmployee(){
            this.employeeData.push({id: this.employeeData.length+1, username: "", pin: 0, manager: false, selected: true});
        },
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