import logging
from datetime import datetime
from django.db import models
from django.db.models import Sum

models_logger = logging.getLogger(__name__)


class Article(models.Model):
    """
    Article model
    Defines the attributes of every item on the inventory.
    """
    name = models.CharField(max_length=200, unique=True)
    sku = models.CharField(max_length=200, unique=True)
    location = models.CharField(max_length=200)
    suggested_price = models.DecimalField(
        max_digits=15, decimal_places=2, default=0)
    status = models.BooleanField(default=True)
    image = models.ImageField(upload_to='images', default='default.png')
    link = models.CharField(max_length=200, default="", blank=True)
    quantity = models.IntegerField(blank=True, default=0)
    created_at = models.DateTimeField(default=datetime.now, blank=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(
        'auth.User', related_name='article_creator', on_delete=models.CASCADE)
    updated_by = models.ForeignKey(
        'auth.User', related_name='article_editor', on_delete=models.CASCADE)

    def __str__(self):
        return self.name


class Location(models.Model):
    """
    Location model
    Defines the attributes of the location of each Article
    """
    article = models.ForeignKey(
        Article, on_delete=models.CASCADE, related_name="article_location")
    body = models.CharField(max_length=200)
    optional = models.BooleanField(default=False)
    status = models.BooleanField(default=True)
    created_at = models.DateTimeField(default=datetime.now, blank=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(
        'auth.User', related_name='location_creator', on_delete=models.CASCADE)
    updated_by = models.ForeignKey(
        'auth.User', related_name='location_editor', on_delete=models.CASCADE)

    def get_stock_count(self, pk):
        res_1 = 0
        res_2 = 0
        loc_res = Stock.objects.filter(location=self.pk, status=True).aggregate(
            total_stock=Sum('quantity'))['total_stock']
        opt_res = Stock.objects.filter(location=pk, status=True).aggregate(
            total_stock=Sum('quantity'))['total_stock']
        if loc_res is not None:
            res_1 = loc_res
        if opt_res is not None:
            res_2 = opt_res
        return res_1, res_2

    def get_formated_location(self):
        optional = Location.objects.get(article=self.article, optional=True)
        stocks = self.get_stock_count(optional.pk)
        location = {
            'id': self.pk,
            'body': self.body,
            'quantity': stocks[0],
        }
        optional_location = {
            'id': optional.pk,
            'body': optional.body,
            'quantity': stocks[1]
        }

        return [location, optional_location]


class Stock(models.Model):
    """
    Article model
    Defines the attributes of every article's stock.
    """
    article = models.ForeignKey(
        Article, related_name='stock_article', on_delete=models.CASCADE)
    location = models.ForeignKey(
        Location, related_name='stock_location', on_delete=models.CASCADE)
    quantity = models.IntegerField(default=0)
    cost = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    status = models.BooleanField(default=True)
    created_at = models.DateTimeField(default=datetime.now, blank=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(
        'auth.User', related_name='stock_creator', on_delete=models.CASCADE)
    updated_by = models.ForeignKey(
        'auth.User', related_name='stock_editor', on_delete=models.CASCADE)

    def __str__(self):
        return "%s - %s" % (str(self.updated_at), self.article.name)


class Sale(models.Model):
    """
    Article model
    Defines the attributes of every sale made by the store.
    """
    stock = models.ForeignKey(
        Stock, related_name='sale_stock', on_delete=models.SET_NULL, null=True)
    quantity = models.IntegerField(default=0)
    price = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    status = models.BooleanField(default=True)
    created_at = models.DateTimeField(default=datetime.now, blank=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(
        'auth.User', related_name='sale_creator', on_delete=models.CASCADE)
    updated_by = models.ForeignKey(
        'auth.User', related_name='sale_editor', on_delete=models.CASCADE)


class Order(models.Model):
    """
    Article model
    Defines the attributes of every article's order.
    """
    # FRESHMAN = 'FR'
    # SOPHOMORE = 'SO'
    # JUNIOR = 'JR'
    # SENIOR = 'SR'
    # GRADUATE = 'GR'
    # YEAR_IN_SCHOOL_CHOICES = [
    #     (FRESHMAN, 'Freshman'),
    #     (SOPHOMORE, 'Sophomore'),
    #     (JUNIOR, 'Junior'),
    #     (SENIOR, 'Senior'),
    #     (GRADUATE, 'Graduate'),
    # ]
    # year_in_school = models.CharField(
    #     max_length=2,
    #     choices=YEAR_IN_SCHOOL_CHOICES,
    #     default=FRESHMAN,
    # )
    article = models.ForeignKey(
        Article, related_name='order_article', on_delete=models.CASCADE)
    body = models.TextField(default="")
    state = models.CharField(max_length=200, default="PENDIENTE")
    status = models.BooleanField(default=True)
    created_at = models.DateTimeField(default=datetime.now, blank=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(
        'auth.User', related_name='order_creator', on_delete=models.CASCADE)
    updated_by = models.ForeignKey(
        'auth.User', related_name='order_editor', on_delete=models.CASCADE)

    def __str__(self):
        return "%s - %s" % (self.article.name, self.status)
