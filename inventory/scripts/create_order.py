from inventory.models import Order, Article
from django.contrib.auth import get_user_model
import csv
import datetime
import json

User = get_user_model()


def run():
    try:
        # article - csv: id, nombre, sku, ubicacion, precio, img, estado, stockTotal
        # article - model: id, name, sku, suggested_price, image, link
        # created_at, updated_at, created_by
        data_json = {}
        with open('articlesid.txt', 'r') as json_file:
            data_json = json.load(json_file)
        with open('old_data/pedido.csv', newline='') as csvfile:
            reader = csv.reader(csvfile, delimiter=',')
            for line in reader:
                data = line
                new_order_data = {
                    "id": int(data[0]),
                    "created_at": data[1],
                    "state": data[3],
                    "article": int(data[2]),
                }
                user = User.objects.get(username="rigo")
                new_id = data_json[new_order_data["article"]]
                article = Article.objects.get(id=new_id)
                Order.objects.create(
                    created_at=new_order_data["created_at"],
                    article=article, state=new_order_data["state"],
                    updated_at=new_order_data["created_at"], created_by=user,
                    updated_by=user
                )

    except Exception as error:
        # if the're a problem anywhere, you wanna know about it
        print("there was a problem with line %s" % error)
