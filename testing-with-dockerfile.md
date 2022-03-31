## 1. Pull the milestone 1 image from docker hub
```bash
$ docker pull web3go/release:milestone1
```


## 2. Run the image
```bash
$ docker run -d -p 8080:8080 --name my-portal-ui web3go/release:milestone1
```

## 3. Visit UI locally
 - For main page:  http://localhost:8080
 - For NFT profiler: http://localhost:8080/#/NFTProfiler
 - For MOVR staking: http://localhost:8080/#/Moonriver
 - For GLMR staking: http://localhost:8080/#/Moonbeam
