from decimal import Decimal
from flask import Flask, render_template, jsonify, request, send_file
from datetime import datetime, timedelta
from ConnectionProvider import get_con
from forecast import predict_sales
from ai_insights import generate_ai_insights
from collections import defaultdict
import calendar
from fpdf import FPDF
import os
import json



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
    past_week = today - timedelta(days=6)

    # Generate all dates
    date_list = [(past_week + timedelta(days=i)) for i in range(7)]

    cursor.execute("""
        SELECT DATE(date) AS date, SUM(total_price) AS total 
        FROM orders 
        WHERE DATE(date) BETWEEN %s AND %s 
        GROUP BY DATE(date)
    """, (past_week, today))
    raw_data = cursor.fetchall()
    con.close()

    sales_dict = {data['date']: data['total'] for data in raw_data}

    labels = [d.strftime('%Y-%m-%d') for d in date_list]
    values = [sales_dict.get(d, 0) for d in date_list]

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

    # Generate weekly ranges
    # Generate weekly ranges
    week_ranges = []
    current = past_month
    while current <= today:
        week_start = current - timedelta(days=current.weekday())  # Monday
        week_end = week_start + timedelta(days=6)  # Sunday
        label = f"{week_start.strftime('%Y/%m/%d')} - {week_end.strftime('%Y/%m/%d')}"
        week_ranges.append((week_start, week_end, label))
        current = week_end + timedelta(days=1)


    # Get weekly sales
    cursor.execute("""
        SELECT 
            MIN(DATE(date)) AS start_date, 
            MAX(DATE(date)) AS end_date, 
            SUM(total_price) AS total 
        FROM orders 
        WHERE DATE(date) BETWEEN %s AND %s 
        GROUP BY YEAR(date), WEEK(date, 3)
    """, (past_month, today))
    raw_data = cursor.fetchall()
    print("Raw Data:", raw_data)  # Debugging line
    con.close()

    # Create totals by range
    totals_by_range = {}
    for row in raw_data:
        # Get the start of the week for the sales date
        week_start = row['start_date'] - timedelta(days=row['start_date'].weekday())  # Get the start of the week (Monday)
        week_end = week_start + timedelta(days=6)  # Get the end of the week (Sunday)
        week_label = f"{week_start.strftime('%Y/%m/%d')} - {week_end.strftime('%Y/%m/%d')}"
        
        # Debugging: Print the week label and total
        print(f"Week Label: {week_label}, Total: {row['total']}")

        # Aggregate totals for the week
        if week_label in totals_by_range:
            totals_by_range[week_label] += row['total']
        else:
            totals_by_range[week_label] = row['total']

    # Prepare labels and values for the chart
    labels = []
    values = []
    for _, _, label in week_ranges:
        labels.append(label)
        # Convert Decimal to float or int
        values.append(float(totals_by_range.get(label, 0)))  # Use float() to convert to a number

    return jsonify({
        "labels": labels,
        "values": values
    })

@app.route('/api/monthly-sales-data', methods=['GET'])
def get_monthly_sales_data():
    con = get_con()
    cursor = con.cursor(dictionary=True)

    today = datetime.today().date()
    past_year = today.replace(day=1) - timedelta(days=11*30)

    # Build list of months
    months = []
    current = past_year
    for _ in range(12):
        months.append((current.year, current.month))
        if current.month == 12:
            current = current.replace(year=current.year + 1, month=1)
        else:
            current = current.replace(month=current.month + 1)

    # Get monthly sales
    cursor.execute("""
        SELECT MONTH(date) AS month, YEAR(date) AS year, SUM(total_price) AS total 
        FROM orders 
        WHERE DATE(date) BETWEEN %s AND %s 
        GROUP BY YEAR(date), MONTH(date)
    """, (past_year, today))
    raw_data = cursor.fetchall()
    con.close()

    totals = defaultdict(float)
    for row in raw_data:
        totals[(row['year'], row['month'])] = row['total']

    labels = [calendar.month_name[month] for _, month in months]
    values = [totals.get((year, month), 0) for year, month in months]

    return jsonify({
        "labels": labels,
        "values": values
    })


@app.route('/api/yearly-sales-data', methods=['GET'])
def get_yearly_sales_data():
    con = get_con()
    cursor = con.cursor(dictionary=True)

    current_year = datetime.today().year
    past_year = current_year - 4
    years = list(range(past_year, current_year + 1))

    cursor.execute("""
        SELECT YEAR(date) AS year, SUM(total_price) AS total 
        FROM orders 
        WHERE YEAR(date) BETWEEN %s AND %s 
        GROUP BY YEAR(date)
    """, (past_year, current_year))
    raw_data = cursor.fetchall()
    con.close()

    sales_by_year = {row['year']: row['total'] for row in raw_data}

    labels = [str(year) for year in years]
    values = [sales_by_year.get(year, 0) for year in years]

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

    cursor.execute("""
        SELECT 
            p.product_name, 
            SUM(s.sales_quantity) AS total_sales
        FROM sales s
        JOIN products p ON s.product_id = p.product_id
        WHERE DATE(s.sale_date) BETWEEN %s AND %s
        GROUP BY p.product_name
        ORDER BY total_sales DESC
    """, (past_week, today))
    
    sales_data = cursor.fetchall()
    con.close()

    return jsonify({
        "labels": [data['product_name'] for data in sales_data],
        "values": [data['total_sales'] for data in sales_data]
    })

@app.route('/api/weekly-sales-by-product', methods=['GET'])
def get_weekly_sales_by_product():
    con = get_con()
    cursor = con.cursor(dictionary=True)

    today = datetime.today().date()
    past_month = today - timedelta(days=30)

    cursor.execute("""
        SELECT 
            p.product_name, 
            SUM(s.sales_quantity) AS total_sales
        FROM sales s
        JOIN products p ON s.product_id = p.product_id
        WHERE DATE(s.sale_date) BETWEEN %s AND %s
        GROUP BY p.product_name, WEEK(s.sale_date)
        ORDER BY total_sales DESC
    """, (past_month, today))
    
    sales_data = cursor.fetchall()
    con.close()

    return jsonify({
        "labels": [data['product_name'] for data in sales_data],
        "values": [data['total_sales'] for data in sales_data]
    })

@app.route('/api/monthly-sales-by-product', methods=['GET'])
def get_monthly_sales_by_product():
    con = get_con()
    cursor = con.cursor(dictionary=True)

    today = datetime.today().date()
    past_year = today - timedelta(days=365)

    cursor.execute("""
        SELECT 
            p.product_name, 
            SUM(s.sales_quantity) AS total_sales
        FROM sales s
        JOIN products p ON s.product_id = p.product_id
        WHERE DATE(s.sale_date) BETWEEN %s AND %s
        GROUP BY p.product_name, MONTH(s.sale_date)
        ORDER BY total_sales DESC
    """, (past_year, today))
    
    sales_data = cursor.fetchall()
    con.close()

    return jsonify({
        "labels": [data['product_name'] for data in sales_data],
        "values": [data['total_sales'] for data in sales_data]
    })

@app.route('/api/yearly-sales-by-product', methods=['GET'])
def get_yearly_sales_by_product():
    con = get_con()
    cursor = con.cursor(dictionary=True)

    today = datetime.today().date()
    past_years = today - timedelta(days=5*365)

    cursor.execute("""
        SELECT 
            p.product_name, 
            SUM(s.sales_quantity) AS total_sales
        FROM sales s
        JOIN products p ON s.product_id = p.product_id
        WHERE DATE(s.sale_date) BETWEEN %s AND %s
        GROUP BY p.product_name, YEAR(s.sale_date)
        ORDER BY total_sales DESC
    """, (past_years, today))
    
    sales_data = cursor.fetchall()
    con.close()

    return jsonify({
        "labels": [data['product_name'] for data in sales_data],
        "values": [data['total_sales'] for data in sales_data]
    })
    
@app.route('/forecast')
def forecast_page():
    return render_template('forecast.html')

@app.route('/api/predicted_sales')
def get_predicted_sales():
    data = {
        'daily': predict_sales('D', 7),
        'weekly': predict_sales('W', 4),
        'monthly': predict_sales('M', 6),
        'yearly': predict_sales('Y', 3)
    }
    return jsonify(data)

@app.route('/insights')
def insights_page():
    return render_template('insights.html')

@app.route('/get_insight')
def get_insight():
    date = request.args.get('date')
    insight_data = generate_ai_insights(date)
    return jsonify(insight_data)


if __name__ == '__main__':
    app.run(debug=True)