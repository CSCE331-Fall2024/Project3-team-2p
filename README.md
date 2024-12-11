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

The server section contains the backend code that supports the client-side application, including database interactions, API endpoints, and server configurations.

TODO fill in apis here