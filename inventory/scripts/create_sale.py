from inventory.models import Article, Sale, Stock, Location
from django.contrib.auth import get_user_model
import csv
import datetime
import pickle

User = get_user_model()


def run():
    try:
        # article - csv: id, nombre, sku, ubicacion, precio, img, estado, stockTotal
        # article - model: id, name, sku, suggested_price, image, link
        # created_at, updated_at, created_by
        data_json = {}
        with open('old_data/articlesid.dictionary', 'rb') as json_file:
            data_json = pickle.load(json_file)
        with open('old_data/venta.csv', newline='') as csvfile:
            reader = csv.reader(csvfile, delimiter=',')
            for line in reader:
                data = line
                new_sale_data = {
                    "id": int(data[0]),
                    "created_at": data[1],
                    "quantity": int(data[2]),
                    "price": float(data[3]),
                    "article": int(data[4]),
                    "cost": float(data[7])
                }
                user = User.objects.get(username="rigo")
                new_id = data_json[new_sale_data["article"]]
                article = Article.objects.get(id=new_id)
                stock = Stock.objects.filter(
                    article=article, cost=new_sale_data["cost"])
                if not stock:
                    location = Location.objects.get(
                        article=article, optional=False)
                    stock = Stock()
                    stock.article = article
                    stock.location = location
                    stock.quantity = 0
                    stock.status = False
                    stock.created_by = user
                    stock.updated_by = user
                    stock.cost = new_sale_data["cost"]
                    stock.save()
                else:
                    stock = stock[0]
                Sale.objects.create(
                    created_at=new_sale_data["created_at"],
                    updated_at=new_sale_data["created_at"],
                    quantity=new_sale_data["quantity"],
                    stock=stock,
                    price=new_sale_data["price"],
                    created_by=user, updated_by=user
                )

    except Exception as error:
        # if the're a problem anywhere, you wanna know about it
        print("there was a problem with line %s" % error)
