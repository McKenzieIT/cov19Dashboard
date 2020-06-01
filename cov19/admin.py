"""
admin
"""
from django.contrib import admin
from cov19.models import Continent, Country, Global

# Register your models here.
admin.site.register(Continent)
admin.site.register(Country)
admin.site.register(Global)
