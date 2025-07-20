# ---- Builder stage ----
FROM node:20-alpine AS builder
WORKDIR /app
ARG GIT_COMMIT=unknown
ENV APP_COMMIT=$GIT_COMMIT
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY . .
RUN npm run build

# ---- Runtime stage ----
FROM nginx:1.27-alpine
RUN addgroup -S web && adduser -S web -G web \
    && mkdir -p /run \
    && chown -R web:web /run /var/cache/nginx /var/run /var/log/nginx /usr/share/nginx/html
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY .htpasswd /etc/nginx/.htpasswd
USER web
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --start-period=15s --retries=3 CMD wget -qO- http://127.0.0.1:8080/ || exit 1
CMD ["nginx","-g","daemon off;"]
