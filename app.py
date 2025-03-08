from flask import Flask, render_template
import mysql.connector

app = Flask(__name__)

def connect_db():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="1024",
        database="ghbpython"
    )

@app.route('/')
def home():
    db = connect_db()
    cursor = db.cursor(dictionary=True)

    # Fetch sales data for the dashboard
    cursor.execute("SELECT DATE(date) as sale_date, SUM(order_items) as total_items, SUM(total_price) as total_sales FROM orders GROUP BY sale_date ORDER BY sale_date DESC LIMIT 7")
    sales_data = cursor.fetchall()

    # Fetch product sales data
    cursor.execute("SELECT p.product_name, SUM(o.order_items) as total_items, SUM(o.total_price) as total_sales FROM orders o JOIN products p ON o.product_id = p.product_id GROUP BY p.product_name")
    product_sales_data = cursor.fetchall()

    # Close the database connection
    cursor.close()
    db.close()

    return render_template('index.html', sales_data=sales_data, product_sales_data=product_sales_data)

if __name__ == '__main__':
    app.run(debug=True)