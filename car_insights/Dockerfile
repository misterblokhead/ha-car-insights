ARG BUILD_FROM
FROM $BUILD_FROM
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r /app/requirements.txt
COPY car_insights /app/car_insights
WORKDIR /app
CMD ["python3", "-m", "car_insights"]
