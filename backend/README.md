# Backend

This is a simple Flask server that gets a post request from the frontend and scrapes and uploads new data to the Solr Server

## Setup

1. Install [Poetry](https://python-poetry.org/docs/)
2. Run the following command in the `backend` directory to activate the virtual environment

    ```bash
    poetry shell
    ```

3. Start the server with the following command

    ```bash
    flask --debug run
    ```

## Usage

1. Send a `POST` request to `http://127.0.0.1/5000` with the following parameters

    ```json
    {
        "manufacturer": "bmw",
        "model": "230",
        "year": 2021
    }
    ```

    if you see the following message

    ```json
    {
        "success": true
    }
    ```

    Then the data has been successfully added to the solr database and can be fetched.
