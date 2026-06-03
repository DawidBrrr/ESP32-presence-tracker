FROM golang:1.21-alpine AS builder

WORKDIR /app
COPY go.mod ./
COPY . .
RUN go mod tidy
RUN CGO_ENABLED=0 GOOS=linux go build -o stresstester main.go

FROM alpine:latest
WORKDIR /root/
COPY --from=builder /app/stresstester .

CMD ["./stresstester"]
