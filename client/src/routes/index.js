import { createRouter, createWebHistory } from "vue-router";
//import App from "../App.vue";
import ManagerHome from "../components/manager_views/ManagerHome.vue"
import ManagerMenu from "../components/manager_views/ManagerMenu.vue"
import ManagerInventory from "../components/manager_views/ManagerInventory.vue";
import ManagerEmployees from "../components/manager_views/ManagerEmployees.vue";
import customerView  from "@/components/customerView.vue";
import cashierView  from "@/components/cashierView.vue";
//add routes here
const routes = [
    /*{
        path: "/",
        name: "App",
        component: ManagerHome, //Change this to home page to pick between manager and customer views
    },*/
    {
        path: "/",
        name: "ManagerHome",
        component: ManagerHome,
    },
    {
        path: "/Menu",
        name: "ManagerMenu",
        component: ManagerMenu,
    },
    {
        path: "/Inventory",
        name: "ManagerInventory",
        component: ManagerInventory,
    },
    {
        path: "/Employees",
        name: "ManagerEmployees",
        component: ManagerEmployees,
    },
    {
        path: "/Customers",
        name: "customerView",
        component: customerView,
    },
    {
        path: "/Cashier",
        name: "cashierView",
        component: cashierView,
    }
];
const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;