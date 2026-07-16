FROM node:24-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

FROM node:24-alpine
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci --omit=dev
COPY backend/src ./src
COPY --from=frontend-build /app/frontend/dist /app/frontend/dist
COPY .env.example /app/.env.example
EXPOSE 3100
CMD ["node", "src/server.js"]
