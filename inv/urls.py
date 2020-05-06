from django.urls import path, include
from rest_framework.routers import DefaultRouter
from inv import views
from django.views.generic import TemplateView

router = DefaultRouter()
router.register(r'inv', views.ArticleViewSet)
router.register(r'stock', views.StockViewSet)
router.register(r'sales', views.SaleViewSet)
router.register(r'orders', views.OrderViewSet)
router.register(r'users', views.UserViewset)

urlpatterns = [
    path("", include(router.urls)),
    path("getUser", views.getUser.as_view())
]
