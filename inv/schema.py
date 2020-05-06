import graphene
from graphene_django.types import DjangoObjectType
from .models import Article, Stock


class ArticuloType(DjangoObjectType):
    class Meta:
        model = Article


class StockType(DjangoObjectType):
    class Meta:
        model = Stock


class Query(graphene.ObjectType):
    all_articulos = graphene.List(ArticuloType)
    all_stock = graphene.List(StockType)

    def resolve_all_articulos(self, info, **kwargs):
        return Article.objects.all()

    def resolve_all_stock(self, info, **kwargs):
        return Stock.objects.select_related('article').all()


schema = graphene.Schema(query=Query)
