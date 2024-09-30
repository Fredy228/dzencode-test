FROM nginx:alpine AS base

FROM base AS development
COPY dev/nginx.conf /etc/nginx/nginx.conf

FROM base AS production
COPY prod/nginx.conf /etc/nginx/nginx.conf
