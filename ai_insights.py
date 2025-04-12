import openai 
import pandas as pd 
import numpy as np 
from ConnectionProvider import get_con 
from datetime import datetime, timedelta

openai.api_key = ''
# Alisin ang key kapag iccommit

def calculate_cv(data):
    return np.std(data) / np.mean(data) if np.mean(data) != 0 else 0

def generate_ai_insights():
    conn = get_con()
    cursor = conn.cursor(dictionary=True)

    today = datetime.today()
    start = today - timedelta(days=7)

    cursor.execute("SELECT total_price FROM orders WHERE date BETWEEN %s AND %s", (start, today))
    orders = [row['total_price'] for row in cursor.fetchall() if row['total_price'] > 0]
    order_cv = calculate_cv(orders)

    cursor.execute("""
        SELECT p.product_name, SUM(s.sales_quantity) AS quantity, SUM(s.total_price) AS revenue
        FROM sales s
        JOIN products p ON s.product_id = p.product_id
        WHERE s.sale_date BETWEEN %s AND %s
        GROUP BY s.product_id
    """, (start, today))
    product_data = cursor.fetchall()

    product_insights = []
    for item in product_data:
        name = item['product_name']
        quantity = item['quantity'] or 0
        revenue = item['revenue'] or 0
        cv = calculate_cv([quantity, revenue])
        product_insights.append(f"{name}: CV={cv:.2f}, Quantity={quantity}, Revenue={revenue}")

    prompt = f"""
    You are an expert business analyst. Based on these coefficient of variation (CV) values from the past 7 days:
    - Weekly Order CV: {order_cv:.2f}
    - Product Sales Insights: {'; '.join(product_insights)}
    Interpret the business performance. Provide insights and suggest a practical business decision.
    """

    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}]
    )
    return response.choices[0].message.content.strip()