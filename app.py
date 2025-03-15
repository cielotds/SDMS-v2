from flask import Flask, render_template, jsonify
from datetime import datetime, timedelta
from ConnectionProvider import get_con


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


if __name__ == '__main__':
    app.run(debug=True)