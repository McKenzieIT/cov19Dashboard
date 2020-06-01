"""cov19 Model Configuration
"""
from django.db import models

# Create your models here.
class Country(models.Model):
    """Class Country"""
    country_name = models.CharField(max_length=100, primary_key=True)
    confirm_total = models.IntegerField()
    confirm_new = models.IntegerField()
    confirm_current = models.IntegerField()
    cured_total = models.IntegerField()
    cured_new = models.IntegerField()
    death_total = models.IntegerField()
    death_new = models.IntegerField()
    # mortality_rate = models.FloatField()
    # cure_rate = models.FloatField()

class Continent(models.Model):
    """Class Continent"""
    continent_name = models.CharField(max_length=100, primary_key=True)
    confirm_current = models.IntegerField()
    confirm_total = models.IntegerField()
    cured_total = models.IntegerField()
    death_total = models.IntegerField()
    countries = models.CharField(max_length=2000)

class Global(models.Model):
    """Class Global"""
    confirm_current = models.IntegerField()
    confirm_total = models.IntegerField()
    confirm_new = models.IntegerField()
    cured_total = models.IntegerField()
    cured_new = models.IntegerField()
    death_total = models.IntegerField()
    death_new = models.IntegerField()
