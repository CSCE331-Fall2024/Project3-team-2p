# Inventory Service Documentation

## Overview

The Inventory Service manages operations related to menu items, ingredients, and employees. It provides API endpoints for fetching, updating, and ordering data in the inventory system. This service interacts with a database using the `InventoryService` class and exposes routes via an Express.js server.

---

## Database File: `inventory_db.js`

### Class: `InventoryService`

#### Constructor

Initializes the database connection using `DBConnection`.

#### Methods

- **`close()`**

  - Closes the database connection.
  - **Returns:** A promise resolving when the connection is closed.

- **`getMaxID(tableName)`**

  - Retrieves the maximum ID in the specified table.
  - **Parameters:**
    - `tableName` _(string)_: Name of the table.
  - **Returns:** The maximum ID _(number)_ or `0` if no rows exist.

- **`getAllIngredients()`**

  - Fetches all ingredients.
  - **Returns:** An array of ingredients with the following keys:
    - `id`
    - `name`
    - `stock`
    - `threshold`
    - `price`
    - `unit`

- **`getAllMenuItems()`**

  - Fetches all menu items, including associated ingredients.
  - **Returns:** An object containing:
    - `menuItems`: An array of menu items with the following keys:
      - `id`
      - `name`
      - `entree`
      - `price`
      - `ingredients` (array of associated ingredients):
        - `id`
        - `name`
        - `quantity`
        - `unit`

- **`getAllEmployees()`**

  - Fetches all employees.
  - **Returns:** An array of employees with the following keys:
    - `id`
    - `username`
    - `pin`
    - `manager`

- **`updateMenuItems(menuItems)`**

  - Updates the menu items table and their ingredient associations.
  - **Parameters:**
    - `menuItems` _(Array)_: Array of menu item objects.

- **`updateEmployees(employees)`**

  - Updates the employees table.
  - **Parameters:**
    - `employees` _(Array)_: Array of employee objects.

- **`updateIngredients(ingredients)`**

  - Updates the ingredients table.
  - **Parameters:**
    - `ingredients` _(Array)_: Array of ingredient objects.

- **`orderIngredients()`**
  - Updates all ingredient stock levels to their respective thresholds.

---

## Server File: `inventory_server.js`

### Routes

#### **`GET /menu-items`**

Fetches all menu items with their associated ingredients.

- **Response:**
  - **200 OK:** Array of menu items.
  - **500 Internal Server Error:** `{ error: 'Failed to fetch menu items' }`

#### **`POST /menu-items`**

Updates the menu items table and their ingredient associations.

- **Expected Request Body:**
  ```json
  {
    "menuItems": [
      {
        "id": number,
        "name": string,
        "price": number,
        "entree": number,
        "ingredients": [
          {
            "id": number,
            "quantity": number
          }
        ]
      }
    ]
  }
  ```
- **Response:**
  - **201 Created:** `{ message: 'Menu items updated successfully' }`
  - **500 Internal Server Error:** `{ error: 'Failed to update menu items' }`

#### **`GET /ingredients`**

Fetches all ingredients.

- **Response:**
  - **200 OK:** Array of ingredients.
  - **500 Internal Server Error:** `{ error: 'Failed to fetch ingredients' }`

#### **`POST /ingredients`**

Updates the ingredients table.

- **Expected Request Body:**
  ```json
  {
    "ingredients": [
      {
        "id": number,
        "name": string,
        "stock": number,
        "threshold": number,
        "price": number,
        "unit": string
      }
    ]
  }
  ```
- **Response:**
  - **201 Created:** `{ message: 'Ingredients updated successfully' }`
  - **500 Internal Server Error:** `{ error: 'Failed to update ingredients' }`

#### **`GET /employees`**

Fetches all employees.

- **Response:**
  - **200 OK:** Array of employees.
  - **500 Internal Server Error:** `{ error: 'Failed to fetch employees' }`

#### **`POST /employees`**

Updates the employees table.

- **Expected Request Body:**
  ```json
  {
    "employees": [
      {
        "id": number,
        "username": string,
        "pin": number,
        "manager": boolean
      }
    ]
  }
  ```
- **Response:**
  - **201 Created:** `{ message: 'Employees updated successfully' }`
  - **500 Internal Server Error:** `{ error: 'Failed to update employees' }`

#### **`GET /order-ingredients`**

Orders ingredients by updating their stock levels to the threshold.

- **Response:**
  - **201 Created:** `{ message: 'Ordered ingredients!' }`
  - **500 Internal Server Error:** `{ error: 'Failed to order ingredients' }`
