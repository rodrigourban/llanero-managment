from django.db import models


class Article(models.Model):
    name = models.CharField(max_length=200, unique=True)
    sku = models.CharField(max_length=200, unique=True)
    location = models.CharField(max_length=200)
    suggested_price = models.DecimalField(
        max_digits=15, decimal_places=2, default=0)
    status = models.BooleanField(default=True)
    image = models.ImageField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(
        'auth.User', related_name='article_creator', on_delete=models.CASCADE)
    updated_by = models.ForeignKey(
        'auth.User', related_name='article_editor', on_delete=models.CASCADE)

    def __str__(self):
        return self.name


class Stock(models.Model):
    article = models.ForeignKey(
        Article, related_name='stock_article', on_delete=models.CASCADE)
    quantity = models.IntegerField(default=0)
    cost = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    status = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(
        'auth.User', related_name='stock_creator', on_delete=models.CASCADE)
    updated_by = models.ForeignKey(
        'auth.User', related_name='stock_editor', on_delete=models.CASCADE)

    def __str__(self):
        return "%s - %s" % (str(self.date), self.article.name)


class Sale(models.Model):
    quantity = models.IntegerField(default=0)
    price = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    status = models.BooleanField(default=True)
    price = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    stock = models.ForeignKey(
        Stock, related_name='sale_stock', on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(
        'auth.User', related_name='sale_creator', on_delete=models.CASCADE)
    updated_by = models.ForeignKey(
        'auth.User', related_name='sale_editor', on_delete=models.CASCADE)


class Order(models.Model):
    article = models.ForeignKey(
        Article, related_name='order_article', on_delete=models.CASCADE)
    descript = models.TextField()
    status = models.CharField(max_length=200, default="PENDIENTE")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(
        'auth.User', related_name='order_creator', on_delete=models.CASCADE)
    updated_by = models.ForeignKey(
        'auth.User', related_name='order_editor', on_delete=models.CASCADE)

    def __str__(self):
        return "%s - %s" % (self.article.name, self.status)
