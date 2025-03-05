# 📰 NestJS Crypto News API

## 📌 Running steps:

### **1️ Clone the Repository**
```
git clone https://github.com/YOUR_GITHUB_USERNAME/nestjs-news-api.git
cd nestjs-news-api
```

### **2 Run docker compose**
```
docker compose up --build -d
```

### **3 Check requests
News articles:
```
GET http://localhost:3000/news?page=1&limit=100
```

Statistics:
```
GET http://localhost:3000/news/statistics?ticker=SOL&startDate=2023-01-01&endDate=2024-01-01
```

