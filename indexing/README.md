# Running the Apache Solr Server

## First Time Setup

1. Install [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/)
2. Open a terminal at this directory and run the following command to set up the Solr environment

    ```bash
    docker compose up -d
    ```

3. Go to the [Solr Server](http://localhost:8983)
4. Navigate to Collections in the Sidebar and Add a New collection. Set the following parameters
   1. Name: info_retrieval
   2. Config Set: _default
   3. numShards: 1
   4. replicationFactor: 1
5. In the Sidebar, find the Collection Selector and select the `info_retrieval` collection
6. In the Sidebar, select the `Documents` tab under the Collection Selector
7. Under Document Type, select `File Upload` and upload the `output.csv` file
8. In the Sidebar, navigate to the `Query` tab and select `Execute Query` at the bottom of the page to verify that the records have been added.
