from inventory.models import Article, Location, Stock


def run():
    """
    Check if the location and its stocks have the same article
    :return: null
    """
    try:
        print('Looking for inconsistencies..')
        articles = Article.objects.all()
        for article in articles:
            locations = article.article_location.all()
            stocks = article.stock_article.filter(status=True)
            for stock in stocks:
                if stock.location != locations[0] and stock.location != locations[1]:
                    print(f'INCONSISTENCY FOUND IN {stock}')
                    print(stock.location)
                    print(locations[0])


    except Exception as error:
        # if the're a problem anywhere, you wanna know about it
        print("there was a problem with line %s" % error)
