import logging
from django.db.models.signals import m2m_changed, post_save
from django.dispatch import receiver
from django.db.models import Sum
from .models import Article, Location, Stock


views_logger = logging.getLogger(__name__)

@receiver(post_save, sender=Article)
def create_articles_locations(sender, instance, **kwargs):
    """
    Creates location after an article has been created
    :param sender:
    :param instance:
    :param kwargs:
    :return:
    """
    views_logger.info("SIGNAL: CREATING ARTICLE\'S LOCATIONS ")
    pass


@receiver(post_save, sender=Stock)
def increase_article_total_stock_count(sender, instance, **kwargs):
    views_logger.info("SIGNAL: UPDATING ARTICLE\'S TOTAL STOCK")
    article = instance.article
    loc_res = Stock.objects.filter(article=article.pk, status=True).aggregate(
        total_stock=Sum('quantity'))['total_stock']
    total_stock = 0
    if loc_res > 0:
        total_stock = loc_res
    article.quantity = total_stock
    article.save()
