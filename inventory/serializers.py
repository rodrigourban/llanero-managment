from django.contrib.auth import get_user_model
from rest_framework import serializers
from django.db.models import Sum
from .models import Article, Stock, Sale, Order, Location

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            "pk",
            "username",
            "email",
            "date_joined",
            "is_staff",
            "is_active"
        )


class ArticleSerializer(serializers.ModelSerializer):
    cost = serializers.SerializerMethodField('get_cost')
    stock_list = serializers.SerializerMethodField('get_stock_list')
    location = serializers.SerializerMethodField('get_location')

    def get_location(self, obj):
        result = [{"body": "", "quantity": 0}, {"body": "", "quantity": 0}]
        try:
            location = Location.objects.get(article=obj.pk, optional=False)
            result = location.get_formated_location()
        except Exception as error:
            print("Error get_location %s" % error)
        return result

    def get_cost(self, obj):
        stock = Stock.objects.filter(
            article=obj.pk, status=True).order_by('-created_at')
        count = 0
        if stock.count() >= 1:
            count = stock[0].cost
        return count

    def get_stock_list(self, obj):
        stock = Stock.objects.filter(article=obj.pk, status=True)
        stock_serializer = StockSerializer(stock, many=True)
        return stock_serializer.data

    class Meta:
        model = Article
        fields = (
            "id",
            "name",
            "sku",
            "suggested_price",
            "status",
            "image",
            "cost",
            "quantity",
            "location",
            "link",
            "stock_list",
            "created_at",
            "updated_at",
            "created_by",
            "updated_by"
        )


class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = (
            "id",
            "body",
            "article",
            "optional",
            "status",
            "created_at",
            "updated_at",
            "created_by",
            "updated_by"
        )


class StockSerializer(serializers.ModelSerializer):
    location_name = serializers.SerializerMethodField('get_loc_name')

    def get_loc_name(self, obj):
        return obj.location.body

    class Meta:
        model = Stock
        fields = (
            "id",
            "article",
            "quantity",
            "cost",
            "status",
            "location",
            "location_name",
            "created_at",
            "updated_at",
            "created_by",
            "updated_by"
        )


class SaleSerializer(serializers.ModelSerializer):
    article = serializers.ReadOnlyField()
    additional = serializers.SerializerMethodField('get_net_gross')

    def get_net_gross(self, obj):
        stock = obj.stock
        article = obj.stock.article
        _gross = (obj.quantity * obj.price)
        return {
            'cost': stock.cost,
            'net': _gross,
            'gross': _gross - (obj.quantity * stock.cost),
            'article': article.name
        }

    class Meta:
        model = Sale
        fields = (
            "id",
            "additional",
            "stock",
            "quantity",
            "article",
            "price",
            "status",
            "created_at",
            "updated_at",
            "created_by",
            "updated_by"
        )


class OrderSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField('get_article_name')

    def get_article_name(self, obj):
        return obj.article.name

    class Meta:
        model = Order
        fields = (
            "id",
            "article",
            "name",
            "body",
            "status",
            "state",
            "created_at",
            "updated_at",
            "created_by",
            "updated_by"
        )
