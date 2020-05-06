from django.shortcuts import render
import logging
import copy
import datetime
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import ArticleSerializer, StockSerializer, SaleSerializer, OrderSerializer, UserSerializer, LocationSerializer
from rest_framework.pagination import PageNumberPagination
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from django.core.exceptions import ValidationError
from django.db.models import Sum, F, DecimalField, IntegerField
from django.contrib.auth import get_user_model
from django.utils import timezone
from .models import Article, Stock, Sale, Order, Location


views_logger = logging.getLogger(__name__)
User = get_user_model()


class ArticleViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides `list`, `create`, `retrieve`,
    `update` and `destroy` actions.
    """
    serializer_class = ArticleSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = (TokenAuthentication,)
    pagination_class = PageNumberPagination

    def get_queryset(self):
        search = self.request.query_params.get('search', "")
        orderField = self.request.query_params.get('order', 'created_at')
        orderType = self.request.query_params.get('type', "")
        queryset = Article.objects.filter(status=True, name__icontains=search).order_by(
            '%s%s' % (orderType, orderField)) | Article.objects.filter(status=True, sku__icontains=search).order_by(
            '%s%s' % (orderType, orderField)) | Article.objects.filter(status=True, created_at__icontains=search).order_by(
            '%s%s' % (orderType, orderField))
        return queryset

    def create(self, request, *args, **kwargs):
        try:
            views_logger.info("%s IS CREATING AN ARTICLE", self.request.user)
            payload = copy.copy(request.data)
            location = payload['location']
            payload.pop('location', None)
            views_logger.info("%s", payload)
            payload['created_by'] = self.request.user.pk
            payload['updated_by'] = self.request.user.pk
            payload['status'] = True
            article_serializer = ArticleSerializer(data=payload)
            article_serializer.is_valid(raise_exception=True)
            article_serializer.save()
            location_serializer = LocationSerializer(data={
                'article': article_serializer.data['id'],
                'body': location,
                'created_by': self.request.user.pk,
                'updated_by': self.request.user.pk,
            })
            location_serializer.is_valid(raise_exception=True)
            location_serializer.save()
            optional_location_serializer = LocationSerializer(data={
                'article': article_serializer.data['id'],
                'body': "ML",
                "optional": True,
                'created_by': self.request.user.pk,
                'updated_by': self.request.user.pk,
            })
            optional_location_serializer.is_valid(raise_exception=True)
            optional_location_serializer.save()
            views_logger.info("ARTICLE CREATED SUCCESSFULLY")
            return Response(article_serializer.data)
        except ValidationError as error:
            views_logger.error("ERROR WHILE CREATING ARTICLE %s", error)
            return Response({'message': error.as_json}, status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, *args, **kwargs):
        try:
            views_logger.info("RETRIEVING ARTICLES FOR %s", self.request.user)
            instance = self.get_object()
            serializer = ArticleSerializer(
                instance=instance)
            return Response(serializer.data)
        except ValidationError as error:
            views_logger.error("ERROR WHILE RETRIEVING ARTICLE %s" % error)
            return Response({'message': error.as_json}, status.HTTP_400_BAD_REQUEST)

    def partial_update(self, request, pk=None):
        try:
            views_logger.info("START PARTIAL UPDATE ARTICLE")
            payload = request.data
            views_logger.info("%s", payload)
            payload['updated_by'] = self.request.user.pk
            if 'location' in payload.keys():
                views_logger.info("Actualizando las ubicacion")
                loc = Location.objects.get(article=pk, optional=False)
                loc.body = payload['location']
                loc.update_by = self.request.user.pk
                loc.save()
                payload.pop('location', None)
            if 'optional_location' in payload.keys():
                views_logger.info("Actualizando la ubicacion opcional")
                loc = Location.objects.get(article=pk, optional=True)
                loc.body = payload['optional_location']
                loc.update_by = self.request.user.pk
                loc.save()
                payload.pop('location', None)
            article = Article.objects.get(id=pk)
            serializer = ArticleSerializer(
                article, data=payload, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            views_logger.info("ARTICLE UPDATED SUCCESSFULLY")
            views_logger.info(serializer.data)
            return Response(serializer.data)
        except ValidationError as error:
            views_logger.error("ERROR WHILE UPDATING ARTICLE %s" % error)
            return Response({'message': error.as_json}, status.HTTP_400_BAD_REQUEST)


class StockViewSet(viewsets.ModelViewSet):
    queryset = Stock.objects.all()
    serializer_class = StockSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = (TokenAuthentication,)

    def create(self, request, *args, **kwargs):
        try:
            views_logger.info("%s IS CREATING AN STOCK", self.request.user)
            payload = copy.copy(request.data)
            views_logger.info("%s", payload)
            payload['created_by'] = self.request.user.pk
            payload['updated_by'] = self.request.user.pk
            serializerStock = StockSerializer(data=payload)
            serializerStock.is_valid(raise_exception=True)
            serializerStock.save()
            views_logger.info("ARTICLE CREATED SUCCESSFULLY")
            return Response(serializerStock.data)
        except ValidationError as error:
            views_logger.error("ERROR WHILE CREATING ARTICLE %s", error)
            return Response({'message': error.as_json}, status.HTTP_400_BAD_REQUEST)


class SaleViewSet(viewsets.ModelViewSet):
    queryset = Sale.objects.all()
    serializer_class = SaleSerializer
    pagination_class = PageNumberPagination
    permission_classes = [IsAuthenticated]
    authentication_classes = (TokenAuthentication,)

    def get_queryset(self):
        search = self.request.query_params.get('search', "")
        orderField = self.request.query_params.get(
            'order', 'created_at')
        orderType = ''
        if (orderField[0] == '-'):
            orderType = '-'
            orderField = orderField[1:]
        if (orderField == 'name' or orderField == '-name'):
            orderField = 'stock__article__name'
        queryset = Sale.objects.filter(quantity__icontains=search).order_by(
            '%s%s' % (orderType, orderField)) | Sale.objects.filter(price__icontains=search).order_by(
            '%s%s' % (orderType, orderField)) | Sale.objects.filter(created_at__icontains=search).order_by(
            '%s%s' % (orderType, orderField))
        return queryset

    def create(self, request, *args, **kwargs):
        try:
            views_logger.info("START CREATING SALE")
            views_logger.info("%s", request.data)
            quantity = int(self.request.data['quantity'])
            res = Stock.objects.filter(
                location=self.request.data['location']).aggregate(
                location_total_stock=Sum('quantity'))['location_total_stock']
            views_logger.info("TOTAL STOCK IS %s" %
                              res)
            if res >= quantity:
                views_logger.info("ENOUGH STOCK TO CREATE SALE")
                stocks = Stock.objects.filter(
                    location=self.request.data['location'], status=True).order_by('created_at')
                i = 0
                views_logger.info(len(stocks))
                while quantity > 0:
                    new_quantity = stocks[i].quantity - quantity
                    stock_payload = {'quantity': new_quantity,
                                     'updated_by': self.request.user.pk}
                    sale_payload = {
                        'stock': stocks[i].pk,
                        'price': request.data['price'],
                        'quantity': quantity,
                        'created_by': self.request.user.pk,
                        'updated_by': self.request.user.pk
                    }
                    if new_quantity < 0:
                        quantity = abs(new_quantity)
                        sale_payload['quantity'] = stocks[i].quantity
                        stock_payload['quantity'] = 0
                        stock_payload['status'] = False
                    else:
                        quantity = 0
                        if new_quantity == 0:
                            stock_payload['status'] = False

                    sale_serializer = SaleSerializer(data=sale_payload)
                    stock_serializer = StockSerializer(
                        stocks[i], data=stock_payload, partial=True)
                    sale_serializer.is_valid(raise_exception=True)
                    stock_serializer.is_valid(raise_exception=True)
                    sale_serializer.save()
                    stock_serializer.save()
                    i += 1
            else:
                views_logger.info("CANT CREATE SALE, NOT ENOUGH STOCK")
                return Response({'message': 'No hay stock suficiente.'}, status.HTTP_400_BAD_REQUEST)
            views_logger.info("ARTICLE CREATED SUCCESSFULLY")
            return Response(sale_serializer.data)
        except ValidationError as error:
            views_logger.error("ERROR WHILE CREATING ARTICLE %s", error)
            return Response({'message': error.as_json}, status.HTTP_400_BAD_REQUEST)

    def partial_update(self, request, pk=None):
        try:
            views_logger.info("START PARTIAL UPDATE SALE")
            payload = request.data
            views_logger.info("%s", payload)
            payload['updated_by'] = self.request.user.pk
            sale = Sale.objects.get(id=pk)
            if 'returnStock' in payload.keys():
                # do something
                location = Location.objects.get(article=sale.stock.article, optional=False)
                loc_serializer = StockSerializer(data={
                    "article": sale.stock.article.pk,
                    "location": location.pk,
                    "quantity": sale.quantity,
                    "cost": sale.stock.cost,
                    "created_by": self.request.user.pk,
                    "updated_by": self.request.user.pk,
                })
                loc_serializer.is_valid(raise_exception=True)
                loc_serializer.save()
                payload.pop('returnStock', None)
            serializer = SaleSerializer(
                sale, data=payload, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            views_logger.info("SALE UPDATED SUCCESSFULLY")
            views_logger.info(serializer.data)
            return Response(serializer.data)
        except ValidationError as error:
            views_logger.error("ERROR WHILE UPDATING SALE %s" % error)
            return Response({'message': error.as_json}, status.HTTP_400_BAD_REQUEST)


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    pagination_class = PageNumberPagination
    permission_classes = [IsAuthenticated]
    authentication_classes = (TokenAuthentication,)

    def get_queryset(self):
        search = self.request.query_params.get('search', "")
        orderField = self.request.query_params.get('order', 'created_at')
        orderType = ''
        if (orderField[0] == '-'):
            orderType = '-'
            orderField = orderField[1:]
        if (orderField == 'name' or orderField == '-name'):
            orderField = 'article__name'
        queryset = Order.objects.filter(status=True, state__icontains=search).order_by(
            '%s%s' % (orderType, orderField)) | Order.objects.filter(status=True, body__icontains=search).order_by(
            '%s%s' % (orderType, orderField))
        return queryset

    def create(self, request, *args, **kwargs):
        try:
            views_logger.info("START CREATE ORDER %s" % self.request.user)
            payload = request.data
            views_logger.info("%s", payload)
            payload['created_by'] = self.request.user.pk
            payload['updated_by'] = self.request.user.pk
            serializer = OrderSerializer(data=payload)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            views_logger.info("ORDER CREATED SUCCESSFULLY")
            return Response(serializer.data)
        except ValidationError as error:
            views_logger.error("ERROR WHILE RETRIEVING ARTICLE %s" % error)
            return Response({'message': error.as_json}, status.HTTP_400_BAD_REQUEST)

    def partial_update(self, request, pk=None):
        try:
            views_logger.info("START PARTIAL UPDATE ORDER")
            payload = request.data
            views_logger.info("%s", payload)
            payload['updated_by'] = self.request.user.pk
            order = Order.objects.get(id=pk)
            serializer = OrderSerializer(
                order, data=payload, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            views_logger.info("ORDER UPDATED SUCCESSFULLY")
            views_logger.info(serializer.data)
            return Response(serializer.data)
        except ValidationError as error:
            views_logger.error("ERROR WHILE UPDATING ORDER %s" % error)
            return Response({'message': error.as_json}, status.HTTP_400_BAD_REQUEST)


class UserViewset(viewsets.ModelViewSet):
    # Viewset automatically provides "list" and "detail"
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = (TokenAuthentication,)

    def get_queryset(self):
        search = self.request.query_params.get('search', "")
        orderField = self.request.query_params.get('order', 'date_joined')
        orderType = ''
        queryset = User.objects.filter(is_active=True, username__icontains=search).order_by(
            '%s%s' % (orderType, orderField)) | User.objects.filter(is_active=True, email__icontains=search).order_by(
            '%s%s' % (orderType, orderField))
        return queryset

    def partial_update(self, request, pk=None):
        try:
            views_logger.info("START PARTIAL UPDATE USER")
            payload = request.data
            views_logger.info("%s", payload)
            user = User.objects.get(id=pk)
            serializer = UserSerializer(
                user, data=payload, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            views_logger.info("USER UPDATED SUCCESSFULLY")
            views_logger.info(serializer.data)
            return Response(serializer.data)
        except ValidationError as error:
            views_logger.error("ERROR WHILE UPDATING USER %s" % error)
            return Response({'message': error.as_json}, status.HTTP_400_BAD_REQUEST)


class getUser(APIView):
    # permission_classes = (permissions.IsAuthenticated,)
    def post(self, request, format=None):
        if 'token' not in request.data:
            return Response({'message': 'Please enter token'})
        data = request.data
        token = Token.objects.get(key=data['token'])
        User = UserSerializer(token.user)
        return Response(User.data)


class getTotals(APIView):
    def get(self, request, format=None):
        try:
            res = Stock.objects.filter(status=True).aggregate(
                stock_total=Sum('quantity'),
                price_total=(Sum(F('quantity') * F('cost'),
                                 output_field=DecimalField())))
            # res2 = Stock.objects.filter(
            # status=True).aggregate(total=(Sum(F('quantity') * F('cost'))))['total']
            return Response(res)
        except ValidationError as error:
            views_logger.error("ERROR WHILE GET TOTALS %s" % error)
            return Response({'message': error.as_json}, status.HTTP_400_BAD_REQUEST)


class getEarnings(APIView):
    def post(self, request, format=None):
        try:
            if 'dateFrom' not in request.data.keys() or 'dateTo' not in request.data.keys():
                raise ValidationError("Please provide dateFrom and dateTo")
            dateFrom = self.request.data.get('dateFrom', None)
            dateTo = self.request.data.get('dateTo', None)
            dateType = self.request.data.get('dateType', None)
            current_timezone = timezone.get_current_timezone()
            date_from = current_timezone.localize(datetime.datetime.strptime(dateFrom, '%Y-%m-%d'))
            date_to = current_timezone.localize(datetime.datetime.strptime(dateTo, '%Y-%m-%d'))
            date_to += datetime.timedelta(days=1)
            sales = Sale.objects.filter(
                status=True, created_at__gte=date_from, created_at__lte=date_to)
            labels = []
            earnings_data = []
            quantity_data = []
            gross_data = []
            earnings_total = 0
            gross_total = 0
            quantity_total = 0
            for el in sales:
                cost = el.stock.cost
                labels.append(el.created_at.strftime("%d/%m/%Y"))
                earnings_data.append(
                    (el.quantity*el.price) - (el.quantity*cost))
                gross_data.append(
                    (el.quantity * el.price))
                quantity_data.append(el.quantity)
                earnings_total += (el.quantity*el.price) - (el.quantity*cost)
                gross_total += (el.quantity * el.price)
                quantity_total += el.quantity
            return Response(
                {
                    "labels": labels,
                    "earnings": earnings_data, "earnings_total": earnings_total,
                    "quantity": quantity_data, "quantity_total": quantity_total,
                    "gross": gross_data, "gross_total": gross_total},
                status.HTTP_200_OK
            )
        except ValidationError as error:
            views_logger.error("ERROR GET EARNINGS %s" % error)
            return Response({'message': error.message}, status.HTTP_400_BAD_REQUEST)


class transferStock(APIView):
    def post(self, request, format=None):
        try:
            if 'origin' not in request.data.keys() \
                    or 'destination' not in request.data.keys() \
                    or 'quantity' not in request.data.keys():
                raise ValidationError("Please provide dateFrom and dateTo")
            origin = self.request.data.get('origin', None)
            destination = self.request.data.get('destination', None)
            quantity = self.request.data.get('quantity', None)
            print("args %s %s %s" % (origin,destination,quantity))
            # Add in destination
            stock_origin = Stock.objects.filter(location=origin, status=True)
            destination_serializer = StockSerializer(data={
                'article': stock_origin[0].article.pk,
                'location': destination,
                'quantity': quantity,
                'cost': stock_origin[0].cost,
                'created_by': self.request.user.pk,
                'updated_by': self.request.user.pk
            })
            destination_serializer.is_valid(raise_exception=True)
            destination_serializer.save()
            # Delete in origin
            i = 0
            while quantity > 0:
                new_quantity = stock_origin[i].quantity - quantity
                stock_payload = {'quantity': new_quantity,
                                 'updated_by': self.request.user.pk}
                if new_quantity < 0:
                    quantity = abs(new_quantity)
                    stock_payload['quantity'] = 0
                    stock_payload['status'] = False
                else:
                    quantity = 0
                    if new_quantity == 0:
                        stock_payload['status'] = False

                stock_serializer = StockSerializer(
                    stock_origin[i], data=stock_payload, partial=True)
                stock_serializer.is_valid(raise_exception=True)
                stock_serializer.save()
                i += 1
            return Response(destination_serializer.data)
        except ValidationError as error:
            views_logger.error("Error in transfer stock %s" % error)
            return Response({'message': error.message}, status.HTTP_400_BAD_REQUEST)

