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

        for (const item of menuItems.menuItems) {
            if (item.id === 2) {
                console.log(`Ingredients for menu item with id 2 (${item.name}):`, item.ingredients);
            }
        }
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
        {
            id: 2,
            name: "Honey Walnut Shrimp",
            price: 1.99,
            entree: 1,
            ingredients: [
                { id: 9, name: "Shrimp", quantity: 100, unit: "g" },
                { id: 12, name: "Walnuts", quantity: 50, unit: "g" }
            ]
        },
        {
            id: 17,
            name: "String Bean Salad",
            price: 0.00,
            entree: 0,
            ingredients: [
                { id: 1, name: "String Bean", quantity: 200, unit: "g" }
            ]
        }
    ];

    try {
        await inventoryService.updateMenuItems(testMenuItems);
        console.log("Test successful: Menu items sent to backend.");
    } catch (error) {
        console.error("Test failed:", error);
    } finally {
        await inventoryService.pool.end();
    }
}

async function testUpdateEmployees() {
    const inventoryService = new InventoryService();

    const testEmployees = [
        { id: 1002, username: "timtak", pin: 1337, manager: false }, 
        { id: 2, username: "Random fella", pin: 1000, manager: false }
    ];

    try {
        console.log("Testing employee updates and inserts...");
        await inventoryService.updateEmployees(testEmployees);
        console.log("Test successful: Employee records updated/inserted as expected.");
    } catch (error) {
        console.error("Test failed:", error);
    } finally {
        await inventoryService.pool.end();
    }
}

async function testUpdateIngredients() {
    const inventoryService = new InventoryService();

    const testIngredients = [
        { id: 18, name: 'Beef', stock: 1119802, threshold: 1120000, price: 0.08, unit: 'g' },
        { id: 24, name: 'Random Ingredient', stock: 5000, threshold: 6000, price: 1.25, unit: 'ml' }
    ];

    try {
        console.log("Testing ingredient updates and inserts...");
        await inventoryService.updateIngredients(testIngredients);
        console.log("Test successful: Ingredient records updated/inserted as expected.");
    } catch (error) {
        console.error("Test failed:", error);
    } finally {
        await inventoryService.pool.end();
    }
}

// testGetAllIngredients();
// testGetAllMenuItems();
// testGetEmployees();

testSendMenuToBackend();
testGetAllMenuItems();

// testUpdateEmployees();
// testGetEmployees();

// testUpdateIngredients();
// testGetAllIngredients();