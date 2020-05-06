from inventory.models import Article, Location, Stock
from django.contrib.auth import get_user_model
import csv
import datetime
import json

User = get_user_model()


def run():
    try:
        # stock - csv: id, fecha, cantidad, costo, articulo_id
        # stock - model: id, created_at, updated_at, created_by, article, quantity, cost
        data_json = {}
        with open('articlesid.txt', 'r') as json_file:
            data_json = json.load(json_file)

        with open('old_data/stock.csv', newline='') as csvfile:
            reader = csv.reader(csvfile, delimiter=',')
            stock_json = {}
            for line in reader:
                data = line
                new_stock_data = {
                    "id": int(data[0]),
                    "created_at": data[1],
                    "quantity": int(data[2]),
                    "cost": float(data[3]),
                    "article": int(data[4])
                }
                user = User.objects.get(username="rigo")
                new_id = data_json[new_stock_data["article"]]
                article = Article.objects.get(id=new_id)
                location = Location.objects.get(
                    article=article, optional=False)
                stock = Stock()
                stock.created_at = new_stock_data["created_at"]
                stock.updated_at = new_stock_data["created_at"],
                stock.article = article
                stock.location = location
                stock.quantity = new_stock_data["quantity"]
                stock.cost = new_stock_data["cost"],
                stock.created_by = user
                stock.updated_by = user
                stock.save()
                stock_json[new_stock_data["id"]] = stock.id
            with open('stockid.txt', 'w') as outfile:
                json.dumps(stock_json, outfile)

    except Exception as error:
        # if the're a problem anywhere, you wanna know about it
        print("there was a problem with line %s" % error)
