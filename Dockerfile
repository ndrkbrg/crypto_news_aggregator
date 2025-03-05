# Build Stage
FROM node:20 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install --only=production

COPY prisma ./prisma
RUN npx prisma generate  # Generate Prisma client

COPY . .

RUN npm run build

# Run stage
FROM node:20 AS runner

WORKDIR /app


COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src/data/mock_news.json /app/data/mock_news.json

EXPOSE 3000

CMD npx prisma migrate deploy && node dist/main
