from django.contrib.auth.models import User
from rest_framework import serializers
from inv.models import Article, Stock, Sale, Order
from rest_framework.authtoken.models import Token


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            'username',
            'email',
            'is_staff'
        )


class ArticleSerializer(serializers.ModelSerializer):
    created_by = serializers.ReadOnlyField(source='owner.username')

    class Meta:
        model = Article
        fields = (
            "id",
            "name",
            "sku",
            "location",
            "suggested_price",
            "image",
            "created_by"
        )


class StockSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stock
        fields = (
            "created_at",
            "quantity",
            "cost",
            "article",
            "created_by"
        )


class SaleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sale
        fields = (
            "created_at",
            "quantity",
            "price",
            "stock"
        )


class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = (
            "created_at",
            "article",
            "descript",
            "status"
        )
