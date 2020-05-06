from inv.models import Article, Stock, Sale, Order
from inv.serializers import ArticleSerializer, StockSerializer, SaleSerializer, OrderSerializer, UserSerializer
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework import permissions, viewsets
#from inv.permissions import IsOwnerOrReadOnly
from rest_framework.authtoken.models import Token
from rest_framework.authentication import TokenAuthentication, SessionAuthentication, BasicAuthentication


class UserViewset(viewsets.ModelViewSet):
    # Viewset automatically provides "list" and "detail"
    queryset = User.objects.all()
    serializer_class = UserSerializer


class getUser(APIView):
    # permission_classes = (permissions.IsAuthenticated,)
    def post(self, request, format=None):
        if 'token' not in request.data:
            return Response({'message': 'Please enter token'})
        data = request.data
        token = Token.objects.get(key=data['token'])
        User = UserSerializer(token.user)
        return Response(User.data)


class ArticleViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides `list`, `create`, `retrieve`,
    `update` and `destroy` actions.
    """
    queryset = Article.objects.all().order_by('created_at')
    serializer_class = ArticleSerializer
    authentication_classes = (SessionAuthentication, BasicAuthentication)
    # Commented until implementation of JSONWebToken authentication
    # permission_classes = (
    #   permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def create(self, request, *args, **kwargs):
        serializer = ArticleSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(created_by=self.request.user)
        article = Article.objects.get(name=request.data['name'])
        serializerStock = StockSerializer(data={
            'cant': request.data['totalStock'],
            'cost': request.data['price'],
            'article': article.id
        })
        serializerStock.is_valid(raise_exception=True)
        serializerStock.save()
        return Response(serializer.data)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = ArticleSerializer(instance=instance)
        return Response(serializer.data)


# class ArticleList(generics.ListCreateAPIView):
#     queryset = Article.objects.all()
#     serializer_class = ArticleSerializer
#     permission_classes = (permissions.IsAuthenticatedOrReadOnly,)

#     def perform_create(self, serializer):
#         serializer.save(owner=self.request.user)


# class ArticleDetail(generics.RetrieveUpdateDestroyAPIView):
#     queryset = Article.objects.all()
#     serializer_class = ArticleSerializer
#     permission_classes = (
#         permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly)


class StockViewSet(viewsets.ModelViewSet):
    queryset = Stock.objects.all()
    serializer_class = StockSerializer
    authentication_classes = (TokenAuthentication,)


class SaleViewSet(viewsets.ModelViewSet):
    queryset = Sale.objects.all()
    serializer_class = SaleSerializer
    authentication_classes = (TokenAuthentication,)


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    authentication_classes = (TokenAuthentication,)
