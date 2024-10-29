import InventoryService from './inventory_db.js';

async function testGetAllIngredients() {
    const inventoryService = new InventoryService();

    try {
        const ingredients = await inventoryService.getAllIngredients();
        console.log("Fetched Ingredients:", ingredients);
    } catch (error) {
        console.error("Test failed:", error);
    } finally {
        await inventoryService.close();
    }
}

async function testGetAllMenuItems() {
    const inventoryService = new InventoryService();

    try {
        const menuItems = await inventoryService.getAllMenuItems();
        console.log("Fetched Menu Items:", menuItems);
    } catch (error) {
        console.error("Test failed:", error);
    } finally {
        await inventoryService.close();
    }
}

async function testGetEmployees() {
    const inventoryService = new InventoryService();

    try {
        const employees = await inventoryService.getAllEmployees();
        console.log("Fetched Menu Items:", employees);
    } catch (error) {
        console.error("Test failed:", error);
    } finally {
        await inventoryService.close();
    }
}

async function testSendMenuToBackend() {
    const inventoryService = new InventoryService();

    const testMenuItems = [
        { id: 2, Name: "Honey Walnut Shrimp", "Additional Cost": 1.99, Entree: 1 },
        { id: 17, Name: "String Bean Salad", "Additional Cost": 0.00, Entree: 0 }
    ];

    const testIngredientsMenuItems = {
        2: [9, 12],
        17: [1] 
    };

    try {
        await inventoryService.updateMenuItems(testMenuItems, testIngredientsMenuItems);
        console.log("Test successful: Menu items sent to backend.");
    } catch (error) {
        console.error("Test failed:", error);
    } finally {
        await inventoryService.pool.end();
    }
}

// testGetAllIngredients();
// testGetAllMenuItems();
// testGetEmployees();

// testSendMenuToBackend();
testGetAllMenuItems();