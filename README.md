# Jaeger Opentracing example 01

This is just basic example for demonstration purposes: 

- It uses managed Elasticsearch as the storage backend
- It contains 4 microservices, all services use the same code from `./service`

## Configuration

1. register your Elastic cloud trial
2. set following environment variables

  ```bash
  export ES_SERVER_URLS='<Elasticsearch url from the elastic cloud portal>'
  export ES_USERNAME='elastic'
  export ES_PASSWORD='<Elasticsearch password from the elastic cloud portal>'
  ```

3. build application images `docker-compose build`

4. start the whole setup `docker-compose up`

5. send a few HTTP requests to `http://localhost:3001/local/service1`

6. open `http://localhost:8080` and check recorded traces
