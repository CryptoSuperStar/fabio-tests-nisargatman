# Build stage
FROM node:14.17.0-alpine AS build

WORKDIR /app

COPY package.json .

RUN yarn install

COPY . .
RUN yarn update
RUN yarn build

# Production stage
FROM nginx:1.21.0-alpine

COPY --from=build /app/build /usr/share/nginx/html
# COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY .env .env

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]