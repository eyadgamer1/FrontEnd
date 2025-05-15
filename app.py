import mysql.connector
from mysql.connector import Error

def test_connection():
    # Database configuration
    db_config = {
        'host': 'localhost',
        'user': 'root',  # Replace with your actual MySQL username
        'password': 'root',  # Replace with your actual MySQL password
        'database': 'my_schema'
    }
    
    try:
        # Attempt to establish connection
        conn = mysql.connector.connect(**db_config)
        
        if conn.is_connected():
            print("=== Database Connection Test ===")
            print("✅ Successfully connected to MySQL database!")
            db_info = conn.get_server_info()
            print(f"MySQL Server Version: {db_info}")
            
            # Test creating a cursor
            cursor = conn.cursor()
            print("✅ Successfully created cursor")
            
            # Get database information
            cursor.execute("SELECT DATABASE();")
            database_name = cursor.fetchone()[0]
            print(f"Connected to database: {database_name}")

            # Insert test data
            try:
                insert_query = """
                INSERT INTO users (fullName, email, hashed_password) 
                VALUES (%s, %s, %s);
                """
                user_data =    ("Alice Smith", "alice@example.com", "hashed_password_alice")
                cursor.execute(insert_query, user_data)
                conn.commit()
                print("✅ Test data inserted successfully")
            except Error as insert_error:
                print(f"❌ Error inserting data: {insert_error}")
            
            # Fetch and print the inserted data
            try:
                cursor.execute("SELECT * FROM users;")
                rows = cursor.fetchall()
                print("=== Users Table Data ===")
                for row in rows:
                    print(row)
                print("========================")
            except Error as select_error:
                print(f"❌ Error fetching data: {select_error}")

            # Close cursor and connection
            cursor.close()
            conn.close()
            print("✅ Connection closed properly")
            print("============================")
            return True
            
    except Error as e:
        print("=== Database Connection Test ===")
        print(f"❌ Error connecting to MySQL: {e}")
        print("============================")
        return False

if __name__ == "__main__":
    test_connection()
