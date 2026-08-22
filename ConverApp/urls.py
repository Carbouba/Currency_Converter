from os import name

from django.conf import settings
from django.conf.urls.static import static

from django.urls import path

from ConverApp import views

urlpatterns = [
    path('', views.index, name = 'home'),
    path('api/convert/', views.convert_currency, name = 'convert_currency'),
    path('api/symbols/', views.get_symbols, name = 'currency_symbols')
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)