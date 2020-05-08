from inventory.models import Article, Location, Stock
from django.contrib.auth import get_user_model
import csv
import datetime
import pickle

User = get_user_model()


def validate_and_convert(row):
    # This method should take the row and validate data and convert it
    # to the corresponding types
    return True


def run():
    try:
        # article - csv: id, nombre, sku, ubicacion, precio, img, estado, stockTotal
        # article - model: id, name, sku, suggested_price, image, link
        # created_at, updated_at, created_by
        with open('old_data/articulo.csv', newline='') as csvfile:
            reader = csv.reader(csvfile, delimiter=',')
            data_json = {}
            for line in reader:
                data = line
                new_article_data = {
                    "id": int(data[0]),
                    "name": data[1],
                    "sku": data[2],
                    "location": data[3],
                    "suggested_price": float(data[4]),
                    "status": bool(data[6]),
                    "image": data[5],
                    "quantity": int(data[7]),
                    "link": "",
                    "created_by": 1,
                }
                if new_article_data['status']:
                    # Create without using the id, csv with
                    # old_id, new_id
                    user = User.objects.get(username="rigo")
                    article = Article()
                    article.name = new_article_data["name"]
                    article.sku = new_article_data["sku"]
                    article.suggested_price = new_article_data["suggested_price"]
                    article.image = new_article_data["image"]
                    article.created_at = datetime.datetime.now()
                    article.updated_at = datetime.datetime.now()
                    article.created_by = user
                    article.updated_by = user
                    article.save()
                    data_json[new_article_data["id"]] = article.id
                    Location.objects.create(
                        article=article, body=new_article_data["location"],
                        created_at=datetime.datetime.now(), updated_at=datetime.datetime.now(),
                        created_by=user, updated_by=user,
                    )
                    Location.objects.create(
                        article=article, body="ML", optional=True,
                        created_at=datetime.datetime.now(), updated_at=datetime.datetime.now(),
                        created_by=user, updated_by=user,
                    )
                    print(new_article_data)
            with open('old_data/articlesid.dictionary', 'wb') as outfile:
                pickle.dump(data_json, outfile)

    except Exception as error:
        # if the're a problem anywhere, you wanna know about it
        print("there was a problem with line %s" % error)
