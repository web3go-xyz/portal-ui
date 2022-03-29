## Dependencies

```bash
$ npm install
```

## Building

```bash
$ npm run build
```

## Create docker image
```bash
$ docker build -t portal-ui:v1 .
```

## Run the image
```bash
$ docker run -d -p 8080:8080 --name my-portal-ui portal-ui:v1
```

## UI
```bash
Visit http://localhost:8080 to access the UI
```
