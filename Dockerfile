FROM node:lts-alpine
ENV NODE_ENV=production
# install simple http server for serving static content
RUN npm install -g http-server
WORKDIR /app
COPY ["package.json", "package-lock.json", "./"]
RUN npm install
RUN rm package.json package-lock.json
COPY ./dist/ .
EXPOSE 10005
CMD ["http-server", "dist"]
