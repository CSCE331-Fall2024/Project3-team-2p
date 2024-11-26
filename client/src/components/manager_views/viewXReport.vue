<template>
    <div class="inventory-dashboard">
            <table class="sales-table">
                <thead>
                    <tr>
                        <th>Hour</th>
                        <th>Sales</th>
                        <th>Revenue</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in salesData" :key="index" :class="{ selected: item.selected }">
                        <td>{{ item.hour }}</td>
                        <td>{{ item.sales }}</td>
                        <td>{{ item.revenue }}</td>
                    </tr>
                </tbody>
            </table>
    </div>
</template>

<script>
import axios from 'axios';
axios.defaults.baseURL = process.env.VUE_APP_BASE_URL;
export default {
    data() {
        return {
            salesData: [
                {hour: 1, sales: 12, revenue: 1111},
                {hour: 2, sales: 83, revenue: 2222},
                {hour: 3, sales: 23, revenue: 3333},
                {hour: 4, sales: 34, revenue: 4444},
                {hour: 1, sales: 12, revenue: 1111},
                {hour: 2, sales: 83, revenue: 2222},
                {hour: 3, sales: 23, revenue: 3333},
                {hour: 4, sales: 34, revenue: 4444},
                {hour: 1, sales: 12, revenue: 1111},
                {hour: 2, sales: 83, revenue: 2222},
                {hour: 3, sales: 23, revenue: 3333},
                {hour: 4, sales: 34, revenue: 4444},
                {hour: 1, sales: 12, revenue: 1111},
                {hour: 2, sales: 83, revenue: 2222},
                {hour: 3, sales: 23, revenue: 3333},
                {hour: 4, sales: 34, revenue: 4444},
                {hour: 1, sales: 12, revenue: 1111},
                {hour: 2, sales: 83, revenue: 2222},
                {hour: 3, sales: 23, revenue: 3333},
                {hour: 4, sales: 34, revenue: 4444},
                {hour: 1, sales: 12, revenue: 1111},
                {hour: 2, sales: 83, revenue: 2222},
                {hour: 3, sales: 23, revenue: 3333},
                {hour: 4, sales: 34, revenue: 4444},
                {hour: 1, sales: 12, revenue: 1111},
                {hour: 2, sales: 83, revenue: 2222},
                {hour: 3, sales: 23, revenue: 3333},
                {hour: 4, sales: 34, revenue: 4444},
                {hour: 1, sales: 12, revenue: 1111},
                {hour: 2, sales: 83, revenue: 2222},
                {hour: 3, sales: 23, revenue: 3333},
                {hour: 4, sales: 34, revenue: 4444},
                {hour: 1, sales: 12, revenue: 1111},
                {hour: 2, sales: 83, revenue: 2222},
                {hour: 3, sales: 23, revenue: 3333},
                {hour: 4, sales: 34, revenue: 4444},
                {hour: 1, sales: 12, revenue: 1111},
                {hour: 2, sales: 83, revenue: 2222},
                {hour: 3, sales: 23, revenue: 3333},
                {hour: 4, sales: 34, revenue: 4444},
                {hour: 1, sales: 12, revenue: 1111},
                {hour: 2, sales: 83, revenue: 2222},
                {hour: 3, sales: 23, revenue: 3333},
                {hour: 4, sales: 34, revenue: 4444},
                {hour: 1, sales: 12, revenue: 1111},
                {hour: 2, sales: 83, revenue: 2222},
                {hour: 3, sales: 23, revenue: 3333},
                {hour: 4, sales: 34, revenue: 4444},
                {hour: 1, sales: 12, revenue: 1111},
                {hour: 2, sales: 83, revenue: 2222},
                {hour: 3, sales: 23, revenue: 3333},
                {hour: 4, sales: 34, revenue: 4444},
                {hour: 1, sales: 12, revenue: 1111},
                {hour: 2, sales: 83, revenue: 2222},
                {hour: 3, sales: 23, revenue: 3333},
                {hour: 4, sales: 34, revenue: 4444},
                {hour: 1, sales: 12, revenue: 1111},
                {hour: 2, sales: 83, revenue: 2222},
                {hour: 3, sales: 23, revenue: 3333},
                {hour: 4, sales: 34, revenue: 4444},
                {hour: 1, sales: 12, revenue: 1111},
                {hour: 2, sales: 83, revenue: 2222},
                {hour: 3, sales: 23, revenue: 3333},
                {hour: 4, sales: 34, revenue: 4444},
                {hour: 1, sales: 12, revenue: 1111},
                {hour: 2, sales: 83, revenue: 2222},
                {hour: 3, sales: 23, revenue: 3333},
                {hour: 4, sales: 34, revenue: 4444},
                {hour: 1, sales: 12, revenue: 1111},
                {hour: 2, sales: 83, revenue: 2222},
                {hour: 3, sales: 23, revenue: 3333},
                {hour: 4, sales: 34, revenue: 4444},
                {hour: 1, sales: 12, revenue: 1111},
                {hour: 2, sales: 83, revenue: 2222},
                {hour: 3, sales: 23, revenue: 3333},
                {hour: 4, sales: 34, revenue: 4444},
                {hour: 1, sales: 12, revenue: 1111},
                {hour: 2, sales: 83, revenue: 2222},
                {hour: 3, sales: 23, revenue: 3333},
                {hour: 4, sales: 34, revenue: 4444},
                {hour: 1, sales: 12, revenue: 1111},
                {hour: 2, sales: 83, revenue: 2222},
                {hour: 3, sales: 23, revenue: 3333},
                {hour: 4, sales: 34, revenue: 4444},
                {hour: 1, sales: 12, revenue: 1111},
                {hour: 2, sales: 83, revenue: 2222},
                {hour: 3, sales: 23, revenue: 3333},
                {hour: 4, sales: 34, revenue: 4444},
                {hour: 1, sales: 12, revenue: 1111},
                {hour: 2, sales: 83, revenue: 2222},
                {hour: 3, sales: 23, revenue: 3333},
                {hour: 4, sales: 34, revenue: 4444},
                {hour: 1, sales: 12, revenue: 1111},
                {hour: 2, sales: 83, revenue: 2222},
                {hour: 3, sales: 23, revenue: 3333},
                {hour: 4, sales: 34, revenue: 4444},
                {hour: 1, sales: 12, revenue: 1111},
                {hour: 2, sales: 83, revenue: 2222},
                {hour: 3, sales: 23, revenue: 3333},
                {hour: 4, sales: 34, revenue: 4444},
                {hour: 1, sales: 12, revenue: 1111},
                {hour: 2, sales: 83, revenue: 2222},
                {hour: 3, sales: 23, revenue: 3333},
                {hour: 4, sales: 34, revenue: 4444},
                {hour: 1, sales: 12, revenue: 1111},
                {hour: 2, sales: 83, revenue: 2222},
                {hour: 3, sales: 23, revenue: 3333},
                {hour: 4, sales: 34, revenue: 4444},
                {hour: 1, sales: 12, revenue: 1111},
                {hour: 2, sales: 83, revenue: 2222},
                {hour: 3, sales: 23, revenue: 3333},
                {hour: 4, sales: 34, revenue: 4444},
                {hour: 1, sales: 12, revenue: 1111},
                {hour: 2, sales: 83, revenue: 2222},
                {hour: 3, sales: 23, revenue: 3333},
                {hour: 4, sales: 34, revenue: 4444},
                {hour: 1, sales: 12, revenue: 1111},
                {hour: 2, sales: 83, revenue: 2222},
                {hour: 3, sales: 23, revenue: 3333},
                {hour: 4, sales: 34, revenue: 4444},
                {hour: 1, sales: 12, revenue: 1111},
                {hour: 2, sales: 83, revenue: 2222},
                {hour: 3, sales: 23, revenue: 3333},
                {hour: 4, sales: 34, revenue: 4444},
                {hour: 1, sales: 12, revenue: 1111},
                {hour: 2, sales: 83, revenue: 2222},
                {hour: 3, sales: 23, revenue: 3333},
                {hour: 4, sales: 34, revenue: 4444},
                {hour: 1, sales: 12, revenue: 1111},
                {hour: 2, sales: 83, revenue: 2222},
                {hour: 3, sales: 23, revenue: 3333},
                {hour: 4, sales: 34, revenue: 4444},
                {hour: 1, sales: 12, revenue: 1111},
                {hour: 2, sales: 83, revenue: 2222},
                {hour: 3, sales: 23, revenue: 3333},
                {hour: 4, sales: 34, revenue: 4444},
                {hour: 1, sales: 12, revenue: 1111},
                {hour: 2, sales: 83, revenue: 2222},
                {hour: 3, sales: 23, revenue: 3333},
                {hour: 4, sales: 34, revenue: 4444},
            ],
            //TODO: replace with data from api call
            // salesData: [],
        };
    },
    created() {
        //this.fetchSales();
    },
    methods: {
        async fetchSales() {
            try {
                const response = await axios.get('/api/inventory/sales'); //TODO
                this.salesData = response.data;
                console.log('salesData fetched:', this.salesData);
            } catch (error) {
                console.error('Error fetching salesData:', error);
            }
        },
    }
};
</script>

<style>
.sales-table {
    width: 100%;
    margin: auto;
    background-color: #273043;
    color: white;
    border-collapse: collapse;
}

.sales-table th,
.sales-table td {
    padding: 10px;
    border: 1px solid #555;
    max-width: 0px;
    white-space: nowrap;
    overflow: hidden;
}
</style>