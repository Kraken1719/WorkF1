# ---- Stage 1: build the React app with Node ----
FROM node:22-alpine AS build

WORKDIR /app

# Install dependencies exactly as locked in package-lock.json
COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# API URL is baked into the build; override with --build-arg VITE_API_URL=...
ARG VITE_API_URL=http://localhost:8000/api
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# ---- Stage 2: serve the built files with nginx ----
FROM nginx:1.27-alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
