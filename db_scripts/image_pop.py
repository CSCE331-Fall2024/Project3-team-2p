import csv
import psycopg2

# Database configuration
DB_CONFIG = {
    "dbname": "team_2p_db",
    "user": "team_2p",
    "password": "pawmo",
    "host": "csce-315-db.engr.tamu.edu",
    "port": 5432
}

# CSV file path
CSV_FILE_PATH = "db_scripts/image_pop.csv"

# Table and column configuration
TABLE_NAME = "menuitems"
ID_COLUMN = "id"
IMAGE_COLUMN = "image"

def update_database_from_csv():
    try:
        # Connect to the PostgreSQL database
        conn = psycopg2.connect(**DB_CONFIG)
        cursor = conn.cursor()

        # Open and read the CSV file
        with open(CSV_FILE_PATH, mode='r') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                record_id = int(row['id'])
                image_url = row['link']

                if image_url:  # Only update if the link is not empty
                    query = f"""
                        UPDATE {TABLE_NAME}
                        SET {IMAGE_COLUMN} = %s
                        WHERE {ID_COLUMN} = %s
                    """
                    cursor.execute(query, (image_url, record_id))

        # Commit the changes and close the connection
        conn.commit()
        print("Database updated successfully!")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        if conn:
            cursor.close()
            conn.close()

# Run the function
if __name__ == "__main__":
    update_database_from_csv()
