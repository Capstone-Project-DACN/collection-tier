# collection-tier

`collection-tier` is a backend service designed to efficiently manage and process large collections of data in a data streaming system.

## Architecture and Components

### Workflow
The application's workflow is illustrated in the following diagram, which provides a high-level overview of how the different components interact:

![Workflow Diagram](./resources/images/Collection%20Tier%20-%20Work%20Flow.jpg)

### Kafka
Apache Kafka is used for event streaming and handling high-volume data streams.

### Redis
Redis is employed for storing `device_id` and applying the Bloom filter.

### Docker Compose
The Kafka and Redis services are containerized and managed using Docker Compose. The `docker-compose` configuration file is located in `dockers/kafka-redis`, allowing you to easily spin up the required infrastructure.

## API and Testing

### Postman Collection
A Postman collection is provided to facilitate API testing and exploration. It includes pre-configured requests and examples.

### Postman Environment
An accompanying Postman environment file is also included, allowing you to easily manage variables and configurations for different environments (e.g., development, staging, production).

Both the collection and environment files are located in `resources/postman`.

## Getting Started

1. **Clone the repository:**  

   ```sh
   git clone [repository URL]
   ```

2. **Review the workflow**

    Open the image in `resources/images` to understand the application's flow.

3. **Start the services:**
    Navigate to the `dockers/kafka-redis` directory and run:

    ```sh
    docker-compose up -d
    ```
4. **Import Postman:**

    - Import the collection and environment files from `resources/postman` into Postman.
    - Read the collection documentation carefully before proceeding any actions.

