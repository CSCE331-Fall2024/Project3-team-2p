import psycopg2
import csv
from datetime import datetime

conn = psycopg2.connect(
    host="csce-315-db.engr.tamu.edu",
    database="team_2p_db",
    user="team_2p",
    password="pawmo",
    port="5432"
)

cur = conn.cursor()

query = """
    SELECT o.id AS order_id, 
           o.timestamp::date AS order_date, 
           ing.id AS ingredient_id, 
           SUM(im.quantity) AS total_usage
    FROM orders o
    JOIN menuitemsorders mio ON o.id = mio.orderkey
    JOIN menuitems mi ON mio.menuitemkey = mi.id
    JOIN ingredientsmenuitems im ON mi.id = im.menuitemkey
    JOIN ingredients ing ON im.ingredientkey = ing.id
    GROUP BY o.id, order_date, ing.id, ing.name
"""

cur.execute(query)

results = cur.fetchall()

# print(len(results))
# print(results[1:10])

buckets = {}

for order_id, timestamp, ingredient_id, usage in results:
    if timestamp not in buckets:
        buckets[timestamp] = {}

    if ingredient_id in buckets[timestamp]:
        buckets[timestamp][ingredient_id] += usage
    else:
        buckets[timestamp][ingredient_id] = usage 

print(buckets)

csv_file = 'ingredient_usage_data.csv'
with open(csv_file, mode='w', newline='') as file:
    writer = csv.writer(file)
    writer.writerow(['ingredient_id', 'date', 'usage'])

    for timestamp, ingredients in buckets.items():
        for ingredient_id, usage in ingredients.items():
            writer.writerow([ingredient_id, timestamp, usage])

with open(csv_file, 'r') as file:
    next(file) 
    cur.copy_expert("COPY ingredientusage (ingredient_id, date, usage) FROM STDIN WITH CSV", file)

conn.commit()
cur.close()
conn.close()

print("Data successfully loaded into ingredientusage table.")


