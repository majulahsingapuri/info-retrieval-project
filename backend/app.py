from flask import Flask
from transformers import pipeline, AutoModelForSequenceClassification, AutoTokenizer
from pydantic import BaseModel, StrictStr
from flask_pydantic import validate
from requests import post
from config import config, Config

from crawler import scrape_car_reviews

config:Config

# Set up Transformers
model = AutoModelForSequenceClassification.from_pretrained(config.model_path, num_labels=2,ignore_mismatched_sizes=True)
tokenizer = AutoTokenizer.from_pretrained("cardiffnlp/twitter-roberta-base-sentiment-latest")
pipe = pipeline("text-classification", model=model, tokenizer=tokenizer, padding="max_length", truncation=True, batch_size=16)

# Set up Flask
app = Flask(__name__)

# Set up JSON Form
class RequestData(BaseModel):
    manufacturer: StrictStr
    model: StrictStr
    year: int


@app.route("/", methods=["POST"])
@validate()
def process(body: RequestData):
    reviews = scrape_car_reviews(body.manufacturer, body.model, body.year)
    if reviews.empty:
        return {
            "success": False,
            "reason": "No reviews found"
        }

    print("Calculating Sentiment...")
    reviews["LABEL"] = pipe(list(reviews["TEXT"]))

    print("Adjusting Labels...")
    reviews["LABEL"] = reviews["LABEL"].apply(lambda x: 0 if x["label"] == "LABEL_0" else 1)
    reviews["YEAR"] = body.year
    reviews["MANUFACTURER"] = body.manufacturer
    reviews["MODEL"] = body.model

    print("Adding data to database...")
    url = f"http://{config.solr_url}:8983/solr/info_retrieval/update/json/docs?commitWithin=1000&overwrite=true"
    data = reviews.to_dict("records")
    headers = {
        "content-type": "application/json"
    }
    response = post(url, json=data, headers=headers)
    if response.status_code != 200:
        return {
            "success": "false",
            "reason": response.json()
        }

    return {
        "success": True,
    }
