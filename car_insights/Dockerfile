ARG BUILD_FROM
FROM node:24-alpine AS web
WORKDIR /web
COPY web/package.json web/package-lock.json ./
RUN npm ci
COPY web/ ./
RUN npm run build

FROM $BUILD_FROM
ARG BUILD_VERSION
ENV CAR_INSIGHTS_VERSION=$BUILD_VERSION
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r /app/requirements.txt
COPY car_insights /app/car_insights
COPY --from=web /web/dist /app/web
WORKDIR /app
CMD ["/usr/bin/with-contenv", "python3", "-m", "car_insights"]
