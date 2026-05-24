$ErrorActionPreference = "Stop"

docker build -t nextjs-web .
docker run --rm -p 3000:3000 nextjs-web
