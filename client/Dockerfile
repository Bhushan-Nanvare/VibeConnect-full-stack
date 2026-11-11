# ---- Build stage: compile the React app ----
FROM node:22-alpine AS build

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Vite bakes this into the bundle at build time
ARG VITE_BASEURL
ENV VITE_BASEURL=$VITE_BASEURL

RUN npm run build

# ---- Serve stage: static files behind nginx ----
FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

# Print the app link when the container starts
RUN printf '#!/bin/sh\necho "VibeConnect is running at http://localhost:5173"\n' > /docker-entrypoint.d/99-app-link.sh \
    && chmod +x /docker-entrypoint.d/99-app-link.sh

EXPOSE 80
