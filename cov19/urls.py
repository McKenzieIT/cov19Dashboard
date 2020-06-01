"""cov19 URL Configuration
"""

from django.urls import path
from . import views, tests

app_name = 'cov19'

urlpatterns = [
    path('index/', views.index, name="index"),
    path('country/', views.index, name="country"),
    path('continent/', views.continent, name="continent"),
    path('updatedata/', views.update_data, name='update data'),
    path('test/', tests.test, name='test'),
    path('getcountrydata/', views.get_all_country, name='get all country data'),
    path('gettotalconfirm/', views.get_total_comfirm, name='get total confirm'),
    path('getglobaldata/', views.get_global_data, name='get global data'),
    path('gettop/', views.get_top, name="get the top data accoring to field"),
    path('gettopconfirm/', views.get_top_confirm, name="get the top data accoring to total confirm"),
    path('getbycountry/', views.get_by_country, name='get data by country name'),
    path('getbycontinent/', views.get_by_continent, name='get data by continent name')
]
