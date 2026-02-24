# Dockerfile
FROM node:22

WORKDIR /app

COPY frontend/package*.json ./
RUN npm ci
RUN npm install firebase --save

COPY frontend/ .

EXPOSE 5173
CMD ["npm", "run", "dev"]
