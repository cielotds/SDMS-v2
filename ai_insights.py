import numpy as np
from datetime import datetime, timedelta
from openai import OpenAI
from ConnectionProvider import get_con

def calculate_cv(data):
    return np.std(data) / np.mean(data) if np.mean(data) != 0 else 0

def generate_ai_insights(selected_date=None):
    try:
        conn = get_con()
        cursor = conn.cursor(dictionary=True)

        # Use selected date or default to today
        today = datetime.strptime(selected_date, '%Y-%m-%d') if selected_date else datetime.today()
        start = today - timedelta(days=7)

        # Get order data
        cursor.execute("SELECT total_price FROM orders WHERE date BETWEEN %s AND %s", (start, today))
        orders = [row['total_price'] for row in cursor.fetchall() if row['total_price'] > 0]
        order_cv = calculate_cv(orders) if orders else 0

        # Get product sales data
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

        # Create prompt for AI
        prompt = f"""
        You are an expert business analyst. Analyze the business performance for the period from {start.date()} to {today.date()}:
        - Weekly Order CV: {order_cv:.2f}
        - Product Sales Insights: {'; '.join(product_insights) if product_insights else 'No sales data'}
        
        Provide:
        1. A concise business performance summary
        2. Key insights about sales trends
        3. 3 practical recommendations for improvement
        """

        client = OpenAI(
            base_url="https://openrouter.ai/api/v1",
            api_key="",
        )

        completion = client.chat.completions.create(
            model="deepseek/deepseek-r1:free",
            messages=[{"role": "user", "content": prompt}],
        )

        return {
            "date": today.strftime('%Y-%m-%d'),
            "insight": completion.choices[0].message.content.strip()
        }
    
    except Exception as e:
        print(f"Error generating insights: {str(e)}")
        return {
            "date": today.strftime('%Y-%m-%d') if 'today' in locals() else datetime.today().strftime('%Y-%m-%d'),
            "error": str(e)
        }
    
    finally:
        if 'cursor' in locals(): cursor.close()
        if 'conn' in locals(): conn.close()