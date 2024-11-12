from datetime import datetime, timedelta
import json
import random
import psycopg2
import csv
import os

MENU_FILE = "menu_items.json"
INGREDIENTS_FILE = "ingredients.json"

TYPES = ["BOWL", "PLATE", "DOUBLE PLATE"]
PRICES = {"BOWL" : 8.99, "PLATE" : 9.99, "DOUBLE PLATE" : 11.99}
DAILY_SALES = 2750
NUM_DAYS = 273

class MenuItem:
    def __init__(self, id, name, ingredients, add_cost, entree) -> None:
        self.id = id
        self.name = name
        self.ingredients = ingredients
        self.add_cost = add_cost
        self.entree = entree
    
    def __repr__(self) -> str:
        return f"Name: {self.name}, Ingredients: {len(self.ingredients)}, Additional Cost: {self.add_cost}, Entree: {self.entree}"

class Ingredient:
    def __init__(self, id, name, threshold, price, unit, stock) -> None:
        self.id = id
        self.name = name
        self.threshold = threshold
        self.price = price
        self.unit = unit
        self.stock = stock

    def __repr__(self) -> str:
        return f"Threshold: {self.threshold}, Price: {self.price}, Unit: {self.unit}, Stock: {self.stock}"

class Order:
    def __init__(self, id, server, price, order_type, timestamp) -> None:
        self.id = id
        self.server = server
        self.price = price
        self.order_type = order_type
        self.timestamp = timestamp

    def __repr__(self) -> str:
        return f"Server: {self.server}, Price: {self.price}, Type: {self.order_type}, Timestamp: {self.timestamp}"
 
def load_data():

    """
    Just a helper function to load the data from the jsons into memory
    Also generates id's to write to the db for the ingredients and menu items

    returns menu_items: dict<MenuItem> and Ingredients: dict<Ingredients> 
    """

    with open(MENU_FILE, 'r') as mf:
        menu_items_data = json.load(mf)
    with open(INGREDIENTS_FILE, 'r') as inf:
        ingredients_data = json.load(inf)
    
    ingredients = {}
    ingredient_id = 1 
    for name, data in ingredients_data.items():
        ingredients[name] = Ingredient(ingredient_id, name, data['threshold'], data['price'], data['unit'], max(0, data['threshold'] + random.randint(-10, 10)))
        ingredient_id += 1

    menu_items = {}
    menu_item_id = 1 
    for item, data in menu_items_data.items():
        menu_items[item] = MenuItem(menu_item_id, item, data['Ingredients'], data['Additional Cost'], data['Entree'])
        menu_item_id += 1

    return menu_items, ingredients

def get_order_type():
    return random.choice(TYPES)

def create_random_order(order_id, menu_items, timestamp):
    """
    Creates a random order given an order_id and menu_items (the dictionary from the load_data function)
    This will automatically add the additional cost of menu items to the cost
    Will assign a valid cashier id to the order

    returns the order object + list of entrees + side, you need these to populate the join table
    """

    order_type = get_order_type()
    entrees_count = 1 if order_type == 'BOWL' else 2 if order_type == 'PLATE' else 3
    entrees = random.sample([item for item in menu_items.values() if item.entree == 1], entrees_count)
    side = random.choice([item for item in menu_items.values() if item.entree == 0])

    total_price = PRICES[order_type]
    total_price += sum(entree.add_cost + menu_items[entree.name].add_cost for entree in entrees) + menu_items[side.name].add_cost

    server_id = 1000 + random.randint(2, 7)

    order = Order(id=order_id, server=server_id, price=total_price, order_type=TYPES.index(order_type), timestamp=timestamp)

    return order, entrees, side

def write_menu_items_and_ingredients(menu_items, ingredients):
    conn = psycopg2.connect(
    host="csce-315-db.engr.tamu.edu",
    database="team_2p_db",
    user="team_2p",
    password="pawmo",
    port="5432"
    )

    cur = conn.cursor()

    ingredient_query = """
    INSERT INTO ingredients (id, name, stock, threshold, price, unit)
    VALUES (%s, %s, %s, %s, %s, %s);
    """
    for ingredient in ingredients:
        ing = ingredients[ingredient]
        data = (ing.id, ing.name, ing.stock, ing.threshold, ing.price, ing.unit)
        cur.execute(ingredient_query, data)

    menu_query = """
    INSERT INTO menuitems (id, name, price, entree)
    VALUES (%s, %s, %s, %s)
    """
    for item in menu_items:
        it = menu_items[item]
        data = (item.id, it.name, it.add_cost, it.entree)
        cur.execute(menu_query, data)

    conn.commit()
    cur.close()
    conn.close()

def write_join_table(menu_items, ingredients):
    conn = psycopg2.connect(
    host="csce-315-db.engr.tamu.edu",
    database="team_2p_db",
    user="team_2p",
    password="pawmo",
    port="5432"
    )

    cur = conn.cursor()

    query = """
    INSERT INTO ingredientsmenuitems (id, ingredientkey, menuitemkey, quantity)
    VALUES (%s, %s, %s, %s);
    """
    i = 1
    for item in menu_items:
        for ingredient in menu_items[item].ingredients:
            data = (i, ingredients[ingredient].id, menu_items[item].id, menu_items[item].ingredients[ingredient])
            cur.execute(query, data)
            i += 1

    conn.commit()
    cur.close()
    conn.close()

def write_order(order, entrees, side, menuorderID, cur):
    """
    TODO
    Function to commit an order to the database
    Should also run this once
    """
    
    order_query = """
    INSERT INTO orders (id, server, price, type, timestamp)
    VALUES (%s, %s, %s, %s, %s);
    """

    data = (order.id, order.server, order.price, order.order_type, order.timestamp)
    cur.execute(order_query, data)

    menuitemsorders_query = """
    INSERT INTO menuitemsorders (id, menuitemkey, orderkey)
    VALUES (%s, %s, %s)
    """
    for entree in entrees:
        data = (menuorderID[0], entree.id, order.id)
        cur.execute(menuitemsorders_query, data)
        menuorderID[0] += 1
    
    data = (menuorderID[0], side.id, order.id)
    cur.execute(menuitemsorders_query, data)
    menuorderID[0] += 1 

def write_orders_to_csv(filename, orders):
    with open(filename, mode='w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(['id', 'server', 'price', 'type', 'timestamp'])
        for order in orders:
            writer.writerow([order.id, order.server, order.price, order.order_type, order.timestamp])

def write_menuitemsorders_to_csv(filename, menuorderID, orders):
    with open(filename, mode='w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(['id', 'menuitemkey', 'orderkey'])
        for order, entrees, side in orders:
            for entree in entrees:
                writer.writerow([menuorderID[0], entree.id, order.id])
                menuorderID[0] += 1
            writer.writerow([menuorderID[0], side.id, order.id])
            menuorderID[0] += 1

def copy_csv_to_db(filename, table_name, conn):
    cur = conn.cursor()
    if filename == 'orders.csv':
        copy_sql = f"""
            COPY {table_name}(id, server, price, type, timestamp)
            FROM STDIN
            WITH CSV HEADER
            DELIMITER AS ','
        """
    else:
        copy_sql = f"""
            COPY {table_name}(id, menuitemkey, orderkey)
            FROM STDIN
            WITH CSV HEADER
            DELIMITER AS ','
        """
    with open(filename, 'r') as f:
        cur.copy_expert(sql=copy_sql, file=f)
    conn.commit()
    cur.close()

def main():
    menu_items, ingredients = load_data()

    dailySales = 0
    start_date = datetime(2024, 7, 10)
    orderID = 1
    menuorderID = [1]

    all_orders = []
    all_menuitems_orders = []

    for i in range(0, NUM_DAYS):
        timestamp = start_date + timedelta(days=i) 

        if timestamp.month in [9, 10, 11, 12] and timestamp.weekday() == 4:
            sales_multiplier = 1.5
            daily_target_sales = int(DAILY_SALES * sales_multiplier)
        else:
            daily_target_sales = DAILY_SALES

        dailySales = 0
        while dailySales <= daily_target_sales:
            current_timestamp = timestamp + timedelta(hours=random.randint(7, 20), minutes=random.randint(0, 59))

            order, entrees, side = create_random_order(order_id=orderID, menu_items=menu_items, timestamp=current_timestamp)
            all_orders.append(order)
            all_menuitems_orders.append((order, entrees, side))
            dailySales += order.price
            orderID += 1

    write_orders_to_csv('orders.csv', all_orders)
    write_menuitemsorders_to_csv('menuitemsorders.csv', menuorderID, all_menuitems_orders)

    conn = psycopg2.connect(
        host="csce-315-db.engr.tamu.edu",
        database="team_2p_db",
        user="team_2p",
        password="pawmo",
        port="5432"
    )

    copy_csv_to_db('orders.csv', 'orders', conn)
    copy_csv_to_db('menuitemsorders.csv', 'menuitemsorders', conn)

    conn.close()

    try:
        os.remove('orders.csv')
        os.remove('menuitemsorders.csv')
    except OSError as e:
        print(f"Error: {e.strerror} - {e.filename}")

if __name__ == "__main__":
    main()