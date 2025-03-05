# 📰 NestJS Crypto News API

## 📌 Running steps:

### **1️ Clone the Repository**
```
git clone git@github.com:ndrkbrg/crypto_news_aggregator.git
cd crypto_news_aggregator
```

### 2️⃣ Run docker compose**
```
docker compose up --build -d
```

### 3️⃣ Check requests
News articles:
```
GET http://localhost:3000/news?page=1&limit=100
```

Statistics:
```
GET http://localhost:3000/news/statistics?ticker=SOL&startDate=2023-01-01&endDate=2024-01-01
```

