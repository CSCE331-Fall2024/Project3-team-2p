# Project3-team-2p

## Client

TODO fill in cashier and customer views

### Manager Views

The Manager Views section contains components related to the administrative interface for managing the application. Below are the descriptions for the files included in this section:

1. **`ManagerHome.vue`**  
   Description: This file is the home page for the manager view. It contains the local weather, the usageChart and viewXReport components, as well aas buttons to access the other views. Most CSS elements are declared here.

2. **`ManagerEmployees.vue`**  
   Description: This file provides an interface for interacting with the employees table, allowing edits and additions.

3. **`ManagerInventory.vue`**  
   Description: This file provides an interface for interacting with the inventory table, allowing edits and additions as well as ordering ingredients.

4. **`ManagerMenu.vue`**  
   Description: This file provides an interface for interacting with the menu table, allowing edits and additions. It also contains an ingredient viewer which allows users to edit the ingredients associated with a menu item and the quantity used.

5. **`usageChart.vue`**  
   Description: This file is a component used by ManagerHome.vue. It fetches an ingredient's usage in a given date range, then displays it in an interactive graph.

6. **`viewXReport.vue`**  
   Description: This file is a component used by ManagerHome.vue. It fetches a report of sales and revenue per hour for the current day and displays the data in a table.

## Server

1. **`server.js`**
   This is the main entry point into the server. It houses all the routes within the subdirectories and exposes all the endpoints to the internet.
2. **`Inventory Service`**
   Composed of inventory_db.js and inventory_server.js. The db file houses all of the database operations needed for the server, such as reading and updating ingredients, menu items, and employees, as well as some helper functions. The server contains the endpoints to call those functions from the frontend. The test file is just used for testing the db functions, the tests are not automated
3. **`Analytics Service`**
   Composed of analytics_db.js and analytics_server.js. The db file houses the database logic to pull the analytics from the database. The main table used here is ingredientusage which has a composite index on ingredient_id, timestamp to make queries really fast. The server just houses the routes to access the functionality.
4. **`Translate Service`**
   Functionality is pretty simple, the translate_server houses the logic for the translation feature and provides and endpoint to be called. It uses promises to asynchronously translate all of the text chunks with the Google Translate API to Spanish. The actual DOM element pulling logic is in translate.js on the client side
5. **`Customer Service`**
   Similar to the rest of the services, split into a db and server file. The db file is responsible for processing orders, reading from the database for analytics and also writing to support order placement functionality. The server file exposes the endpoints
6. **`Cashier Service`**
   Inherits from customer service and essentially uses the same database functionality. Used for better modularity in the case that extra features need to be added to Cashier.
7. **`Suggestion Service`**
   Has db and server file. The db file is responsible for pulling the most popular orders from the database in real time. The server exposes an endpoint to call this function from the frontend.
8. **`OAuth Service`**
   Integrated the Google OAuth API for protected routes.
9. **`db_connection.js`**
   A wrapper to generate a database connection object from environment variables

As a note, we use express router to modularize our paths and endpoints and combine them all in server.js
