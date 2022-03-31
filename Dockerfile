FROM node:lts-alpine
ENV NODE_ENV=production
# install simple http server for serving static content
RUN npm install -g http-server
WORKDIR /app
COPY ./dist/ .
EXPOSE 8080
CMD ["http-server", "/app"]
