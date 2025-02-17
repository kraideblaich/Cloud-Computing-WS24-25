import os
import threading
from rest_framework.views import APIView
from django.core.mail import send_mail
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from enum import Enum
from ..models import Order, OrderItem
from ..serializers import OrderSerializer, OrderItemSerializer
from ..stock_management.StockManager import StockManager

class OrderData(Enum):
    ORDER = 'order'
    ORDER_ITEMS = 'order_items'

class OrderView(APIView):
    
    # This GET request will return a json which contains the information of an order and  a list containing all order items 
    # Example request: http://localhost:8000/webshop/order/1
    # Example response:
    '''
    {
    "order": {
        "id": 1,
        "customer_firstname": "Max",
        "customer_lastname": "Mustermann",
        "customer_email": "mustermann@gmail.com",
        "created_at": "2025-01-24T21:24:45.982851Z",
        "status": "PENDING",
        "total_price": "29.99",
        "order_date": "2025-01-24T21:24:45.982851Z"
    },
    "order_items": [
        {
        "id": 1,
        "order_id": 1,
        "product_id": 69,
        "quantity": 1,
        "unit_price": "29.99",
        "total_price": "29.99"
        },
        {...}
    ]
    }
    '''
    def get(self, request, id):
        order = get_object_or_404(Order, id=id)
        order_serializer = OrderSerializer(order)
        order_items = OrderItem.objects.filter(order_id=id)
        order_items_serializer = OrderItemSerializer(order_items, many=True)
        
        response = {
                'order' : order_serializer.data,
                'order_items' : order_items_serializer.data
                }
        
        return Response(response)

    # POST request to create a new order and corresponding order items
    # request has to contain a json with the order information and a list of order_items
    # Example request http://localhost:8000/webshop/order
    def post(self, request):
        order_data = request.data.get(OrderData.ORDER.value)
        order_serializer = OrderSerializer(data=order_data) 

        if order_serializer.is_valid():
            order_serializer.save()
            
            order_items = request.data.get(OrderData.ORDER_ITEMS.value)
            
            for item in order_items:
                item_serializer = OrderItemSerializer(data=item)
                
                if item_serializer.is_valid():
                    item_serializer.save()
                    
            response = {'order': order_serializer.data, 'order_items' : item_serializer.data}
                    
            def send_order_confirmation_email():
                subject = 'Order Confirmation'
                message = f"Thank you for your order, {order_data['customer_firstname']} {order_data['customer_lastname']}!"
                recipient_list = [order_data['customer_email']]
                
                send_mail(
                    subject,
                    message,
                    os.getenv('EMAIL_HOST_USER'),  # Absender
                    #recipient_list,
                    ['nino.zoric@yahoo.de'],  # Empfänger
                    fail_silently=False,
                )
            
            email_thread = threading.Thread(target=send_order_confirmation_email)
            email_thread.start()        

            return Response(response, status=status.HTTP_201_CREATED)

        return Response(order_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        