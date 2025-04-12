import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from ConnectionProvider import get_con
from datetime import datetime, timedelta

def fetch_orders():
    conn = get_con()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT date, total_price FROM orders WHERE status = 'paid'")
    orders = cursor.fetchall()
    conn.close()
    df = pd.DataFrame(orders)
    df['date'] = pd.to_datetime(df['date'])
    return df

def group_sales(df, period):
    if period == 'Y':
        period = 'A' # Convert yearly to pandas-compatible frequency
    df_grouped = df.groupby(pd.Grouper(key='date', freq=period))['total_price'].sum().reset_index()
    df_grouped['day_number'] = (df_grouped['date'] - df_grouped['date'].min()).dt.days
    return df_grouped

def predict_sales(period, forecast_range):
    df = fetch_orders()
    if df.empty:
        return []
    period_map = {
        'D': forecast_range, # daily
        'W': forecast_range, # weekly
        'M': forecast_range, # monthly
        'Y': forecast_range # yearly
    }
    df_grouped = group_sales(df, period)

    X = df_grouped[['day_number']]
    y = df_grouped['total_price']

    model = LinearRegression()
    model.fit(X, y)

    future_days = np.arange(X['day_number'].max() + 1, X['day_number'].max() + period_map[period] + 1).reshape(-1, 1)
    freq_map = {'D': 'D', 'W': 'W', 'M': 'M', 'Y': 'A'}
    future_dates = pd.date_range(start=df_grouped['date'].max() + pd.Timedelta(days=1), periods=period_map[period], freq=freq_map[period])
    predictions = model.predict(future_days)

    result = pd.DataFrame({'date': future_dates, 'predicted_sales': predictions})
    result['date'] = result['date'].dt.strftime('%Y-%m-%d')
    return result.to_dict(orient='records')
