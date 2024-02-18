FROM node:16-alpine as builder
WORKDIR /app

COPY package*.json yarn.lock /app/
RUN yarn install

COPY . .
RUN yarn build



FROM nginx:1.21-alpine

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d

COPY --from=builder /app/dist/ /usr/share/nginx/html