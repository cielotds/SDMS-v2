from flask import Flask, render_template, jsonify
from datetime import datetime, timedelta
from ConnectionProvider import get_con
from flask import Flask, jsonify




app = Flask(__name__)



@app.route('/')
def home():
    return render_template('index.html')

@app.route('/api/realtime', methods=['GET'])
def get_realtime_data():
    con = get_con()
    cursor = con.cursor(dictionary=True)

    today = datetime.today().date()
    yesterday = today - timedelta(days=1)
    past_week = today - timedelta(days=7)

    # Get today's total sales
    cursor.execute("SELECT SUM(total_price) AS total FROM orders WHERE DATE(date) = %s", (today,))
    today_total = cursor.fetchone()['total'] or 0

    # Get yesterday's total sales
    cursor.execute("SELECT SUM(total_price) AS total FROM orders WHERE DATE(date) = %s", (yesterday,))
    yesterday_total = cursor.fetchone()['total'] or 0

    # Get average total sales for the past 7 days
    cursor.execute("SELECT AVG(total_price) AS avg_total FROM orders WHERE DATE(date) BETWEEN %s AND %s", (past_week, yesterday))
    avg_total = cursor.fetchone()['avg_total'] or 0

    # Calculate percentage changes
    percent_change_today = ((today_total - yesterday_total) / yesterday_total * 100) if yesterday_total else 0
    percent_change_avg = ((today_total - avg_total) / avg_total * 100) if avg_total else 0

    con.close()
    
    return jsonify({
        "today": f"₱{today_total:,.2f}",
        "yesterday": f"₱{yesterday_total:,.2f}",
        "average": f"₱{avg_total:,.2f}",
        "percent_today": f"{round(percent_change_today, 2)}%",
        "percent_avg": f"{round(percent_change_avg, 2)}%"
    })

@app.route('/api/daily-sales-data', methods=['GET'])
def get_daily_sales_data():
    con = get_con()
    cursor = con.cursor(dictionary=True)

    today = datetime.today().date()
    past_week = today - timedelta(days=7)

    # Get daily sales data for the past 7 days
    cursor.execute("SELECT DATE(date) AS date, SUM(total_price) AS total FROM orders WHERE DATE(date) BETWEEN %s AND %s GROUP BY DATE(date)", (past_week, today))
    daily_sales_data = cursor.fetchall()

    con.close()

    labels = [data['date'].strftime('%Y-%m-%d') for data in daily_sales_data]
    values = [data['total'] for data in daily_sales_data]

    return jsonify({
        "labels": labels,
        "values": values
    })


@app.route('/api/weekly-sales-data', methods=['GET'])
def get_weekly_sales_data():
    con = get_con()
    cursor = con.cursor(dictionary=True)

    today = datetime.today().date()
    past_month = today - timedelta(days=30)

    # Get weekly sales data for the past 30 days
    cursor.execute("SELECT WEEK(date) AS week, MIN(date) AS start_date, MAX(date) AS end_date, SUM(total_price) AS total FROM orders WHERE DATE(date) BETWEEN %s AND %s GROUP BY WEEK(date)", (past_month, today))
    weekly_sales_data = cursor.fetchall()

    con.close()

    labels = [f"{data['start_date'].strftime('%Y/%m/%d')} - {data['end_date'].strftime('%Y/%m/%d')}" for data in weekly_sales_data]
    values = [data['total'] for data in weekly_sales_data]

    return jsonify({
        "labels": labels,
        "values": values
    })


@app.route('/api/monthly-sales-data', methods=['GET'])
def get_monthly_sales_data():
    con = get_con()
    cursor = con.cursor(dictionary=True)

    today = datetime.today().date()
    past_year = today - timedelta(days=365)

    # Get monthly sales data for the past 365 days
    cursor.execute("SELECT MONTH(date) AS month, YEAR(date) AS year, SUM(total_price) AS total FROM orders WHERE DATE(date) BETWEEN %s AND %s GROUP BY YEAR(date), MONTH(date)", (past_year, today))
    monthly_sales_data = cursor.fetchall()

    con.close()

    month_names = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ]

    labels = [f"{month_names[data['month'] - 1]}" for data in monthly_sales_data]
    values = [data['total'] for data in monthly_sales_data]

    return jsonify({
        "labels": labels,
        "values": values
    })


@app.route('/api/yearly-sales-data', methods=['GET'])
def get_yearly_sales_data():
    con = get_con()
    cursor = con.cursor(dictionary=True)

    today = datetime.today().date()
    past_years = today - timedelta(days=5*365)

    # Get yearly sales data for the past 5 years
    cursor.execute("SELECT YEAR(date) AS year, SUM(total_price) AS total FROM orders WHERE DATE(date) BETWEEN %s AND %s GROUP BY YEAR(date)", (past_years, today))
    yearly_sales_data = cursor.fetchall()

    con.close()

    labels = [data['year'] for data in yearly_sales_data]
    values = [data['total'] for data in yearly_sales_data]

    return jsonify({
        "labels": labels,
        "values": values
    })
    
@app.route('/api/daily-sales-by-product', methods=['GET'])
def get_daily_sales_by_product():
    con = get_con()
    cursor = con.cursor(dictionary=True)

    today = datetime.today().date()
    past_week = today - timedelta(days=7)

    # Get daily sales quantity by product for the past 7 days
    cursor.execute("""
        SELECT p.product_name, SUM(s.sales_quantity) AS total_sales 
        FROM sales s
        JOIN products p ON s.product_id = p.product_id
        WHERE DATE(s.sale_date) BETWEEN %s AND %s 
        GROUP BY p.product_name;
    """, (past_week, today))
    daily_sales_data = cursor.fetchall()

    con.close()

    labels = [data['product_name'] for data in daily_sales_data]
    values = [data['total_sales'] for data in daily_sales_data]

    return jsonify({
        "labels": labels,
        "values": values
    })

@app.route('/api/weekly-sales-by-product', methods=['GET'])
def get_weekly_sales_by_product():
    con = get_con()
    cursor = con.cursor(dictionary=True)

    today = datetime.today().date()
    past_month = today - timedelta(days=30)

    # Get weekly sales quantity by product for the past 30 days
    cursor.execute("""
        SELECT p.product_name, SUM(s.sales_quantity) AS total_sales 
        FROM sales s
        JOIN products p ON s.product_id = p.product_id
        WHERE DATE(s.sale_date) BETWEEN %s AND %s 
        GROUP BY p.product_name, WEEK(s.sale_date);
    """, (past_month, today))
    weekly_sales_data = cursor.fetchall()

    con.close()

    labels = [data['product_name'] for data in weekly_sales_data]
    values = [data['total_sales'] for data in weekly_sales_data]

    return jsonify({
        "labels": labels,
        "values": values
    })

@app.route('/api/monthly-sales-by-product', methods=['GET'])
def get_monthly_sales_by_product():
    con = get_con()
    cursor = con.cursor(dictionary=True)

    today = datetime.today().date()
    past_year = today - timedelta(days=365)

    # Get monthly sales quantity by product for the past 12 months
    cursor.execute("""
        SELECT p.product_name, SUM(s.sales_quantity) AS total_sales 
        FROM sales s
        JOIN products p ON s.product_id = p.product_id
        WHERE DATE(s.sale_date) BETWEEN %s AND %s 
        GROUP BY p.product_name, MONTH(s.sale_date);
    """, (past_year, today))
    monthly_sales_data = cursor.fetchall()

    con.close()

    labels = [data['product_name'] for data in monthly_sales_data]
    values = [data['total_sales'] for data in monthly_sales_data]

    return jsonify({
        "labels": labels,
        "values": values
    })

@app.route('/api/yearly-sales-by-product', methods=['GET'])
def get_yearly_sales_by_product():
    con = get_con()
    cursor = con.cursor(dictionary=True)

    today = datetime.today().date()
    past_years = today - timedelta(days=5*365)

    # Get yearly sales quantity by product for the past 5 years
    cursor.execute("""
        SELECT p.product_name, SUM(s.sales_quantity) AS total_sales 
        FROM sales s
        JOIN products p ON s.product_id = p.product_id
        WHERE DATE(s.sale_date) BETWEEN %s AND %s 
        GROUP BY p.product_name, YEAR(s.sale_date);
    """, (past_years, today))
    yearly_sales_data = cursor.fetchall()

    con.close()

    labels = [data['product_name'] for data in yearly_sales_data]
    values = [data['total_sales'] for data in yearly_sales_data]

    return jsonify({
        "labels": labels,
        "values": values
    })



if __name__ == '__main__':
    app.run(debug=True)