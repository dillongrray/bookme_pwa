
FROM node:18-alpine AS deps

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install


FROM node:18-alpine AS builder

ARG HOMEPAGE_URL
ARG REACT_APP_BACKEND_PATH
ARG REACT_APP_BACKEND_URL
ARG REACT_APP_SUBPATH
ARG REACT_APP_PROXY_PORT
ARG REACT_APP_PROXY_LOCALHOST
ARG REACT_APP_BACKEND_IMAGE_PATH

ENV HOMEPAGE_URL=$HOMEPAGE_URL
ENV REACT_APP_BACKEND_PATH=$REACT_APP_BACKEND_PATH
ENV REACT_APP_BACKEND_URL=$REACT_APP_BACKEND_URL
ENV REACT_APP_SUBPATH=$REACT_APP_SUBPATH
ENV REACT_APP_PROXY_PORT=$REACT_APP_PROXY_PORT
ENV REACT_APP_PROXY_LOCALHOST=$REACT_APP_PROXY_LOCALHOST
ENV REACT_APP_BACKEND_IMAGE_PATH=$REACT_APP_BACKEND_IMAGE_PATH

WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules

RUN node set-homepage.js
RUN node set-manifest-subpath.js
RUN npm run build


FROM nginx:1.23.1-alpine
EXPOSE 80
COPY ./default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/package.json /usr/share/nginx/html/package.json
COPY --from=builder /app/build /usr/share/nginx/html/pwa
