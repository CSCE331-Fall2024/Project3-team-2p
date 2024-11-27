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
                        <td>{{ item.sales_count }}</td>
                        <td>{{ item.total_revenue }}</td>
                    </tr>
                </tbody>
            </table>
    </div>
</template>

<script>
import axios from 'axios';
import { ref, onMounted } from 'vue';
axios.defaults.baseURL = process.env.VUE_APP_BASE_URL;
export default {
    setup() {
        const date = ref('');
        const salesData = ref([]);
        // data() {
        //     return {
        //         date: null,
        //         // salesData: [
        //         //     {hour: 1, sales_count: 12, total_revenue: 1111},
        //         //     {hour: 2, sales_count: 83, total_revenue: 2222},
        //         //     {hour: 3, sales_count: 23, total_revenue: 3333},
        //         //     {hour: 4, sales_count: 34, total_revenue: 4444},
        //         // ],
        //         salesData: [],
        //     };
        // },
        const fetchSales = async () => {
            try {
                const today = new Date();
                date.value = today.toISOString().split('T')[0];
                const response = await axios.get('/api/analytics/x-report', {
                    params: {
                        day: date.value,
                    },
                });
                salesData.value = response.data;
                console.log('salesData fetched:', salesData.value);
            } catch (error) {
                console.error('Error fetching salesData:', error);
                // salesData.value = [
                //     {hour: 1, sales_count: 12, total_revenue: 1111},
                //     {hour: 2, sales_count: 83, total_revenue: 2222},
                //     {hour: 3, sales_count: 23, total_revenue: 3333},
                //     {hour: 4, sales_count: 34, total_revenue: 4444},
                // ];
            }
        }

        onMounted(() => {
            fetchSales();
        });

        return {
            date,
            salesData,
        };
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