# syntax = docker/dockerfile:1.4.0
FROM python:3.10-slim-buster

SHELL ["/bin/bash", "-c"] 

# Install Poetry
RUN pip install poetry

# Copy files
WORKDIR /app
COPY . /app

RUN <<EOF cat >> .env
MODEL_PATH=./model/
SOLR_URL=solr
EOF


# Install Dependencies
RUN poetry export --without-hashes --format=requirements.txt > requirements.txt
RUN pip install --upgrade pip && pip install -r requirements.txt

EXPOSE 5000

CMD [ "flask", "run", "--host=0.0.0.0" ]
