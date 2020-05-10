from inventory.models import Article, Location, Stock
from django.contrib.auth import get_user_model
from django.db.models import Sum

User = get_user_model()


def run():
    try:
        articles = Article.objects.all()
        for article in articles:
            res = 0
            stock = Stock.objects.filter(article=article, status=True).aggregate(
                total_stock=Sum('quantity'))['total_stock']
            if stock:
                res = stock
            print("el stock es ", res)
            article.stock = res
            article.save()
    except Exception as error:
        # if the're a problem anywhere, you wanna know about it
        print("there was a problem with line %s" % error)
