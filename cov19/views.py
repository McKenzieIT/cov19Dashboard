"""
dashboard View Configuration

"""
import json
from django.http import HttpResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
# from django.views.decorators.csrf import csrf_protect
from . import data_mining, models

# Create your views here.


def index(request):
    return render(request, 'index.html')

def continent(request):
    return render(request, 'continent.html')

def update_data(request):
    """update data"""
    data = data_mining.get_normal_data()
    for continent_case in data:
        continent_name = continent_case['continent']
        confirm_current = continent_case['currentConfirmed']
        confirm_total = continent_case['totalConfirmed']
        cured_total = continent_case['totalCured']
        death_total = continent_case['totalDeath']
        countries = ''
        for country in continent_case['country']:
            country_object = models.Country(country_name=country['countryName'], confirm_total=country['totalConfirm'], confirm_new=country['addConfirm'], confirm_current=country['nowConfirm'], cured_total=country['totalHeal'], cured_new=country['addHeal'], death_total=country['totalDead'], death_new=country['addDead'])
            country_object.save()
            countries += country['countryName']+ ' '
        continent_object = models.Continent.objects.create(continent_name=continent_name, confirm_current=confirm_current, confirm_total=confirm_total, cured_total=cured_total, death_total=death_total, countries=countries)
        continent_object.save()
    global_data = data_mining.get_global_data()
    global_object = models.Global(confirm_total=global_data['confirm_total'], confirm_new=global_data['confirm_new'], confirm_current=global_data['confirm_current'], cured_total=global_data['cured_total'], cured_new=global_data['cured_new'], death_total=global_data['death_total'], death_new=global_data['death_new'])
    global_object.save()
    return HttpResponse('<p>Update Success!</p>')

def get_global_data(request):
    result = list()
    global_object = models.Global.objects.last()
    result.append({
        'confirm_total':global_object.confirm_total,
        'confirm_new':global_object.confirm_new,
        'confirm_current':global_object.confirm_current,
        'cured_total':global_object.cured_total,
        'cured_new':global_object.cured_new,
        'death_total':global_object.death_total,
        'death_new':global_object.death_new
    })
    context = {'data':result}
    return HttpResponse(json.dumps(context), content_type='application/json')


def get_all_country(request):
    result = list()
    datalist = models.Country.objects.all()
    for var in datalist:
        result.append({
            'country_name':var.country_name,
            'confirm_total':var.confirm_total,
            'confirm_new':var.confirm_new,
            'confirm_current':var.confirm_current,
            'cured_total':var.cured_total,
            'cured_new':var.cured_new,
            'death_total':var.death_total,
            'death_new':var.death_new
        })
    context = {'data':result}
    return HttpResponse(json.dumps(context), content_type='application/json')

@csrf_exempt
def get_by_country(request):
    result = list()
    country_name = request.POST.get('name')
    country_object = models.Country.objects.get(country_name=country_name)
    result.append({
        'country_name':country_object.country_name,
        'confirm_total':country_object.confirm_total,
        'confirm_new':country_object.confirm_new,
        'confirm_current':country_object.confirm_current,
        'cured_total':country_object.cured_total,
        'cured_new':country_object.cured_new,
        'death_total':country_object.death_total,
        'death_new':country_object.death_new
    })
    context = {'data':result}
    return HttpResponse(json.dumps(context), content_type='application/json')

@csrf_exempt
def get_by_continent(request):
    result = list()
    continent_name = request.POST.get('continent')
    continent_object = models.Continent.objects.get(continent_name=continent_name)
    result.append({
        'confirm_total':continent_object.confirm_total,
        'confirm_current':continent_object.confirm_current,
        'cured_total':continent_object.cured_total,
        'death_total':continent_object.death_total
    })
    context = {'data':result}
    return HttpResponse(json.dumps(context), content_type='application/json')

@csrf_exempt
def get_top(request):
    result = list()
    top = int(request.POST.get('top'))
    field = request.POST.get('field')
    datalist = models.Country.objects.order_by("-"+field).values('country_name', field)[0:top]
    for var in datalist:
        result.append({
            'country_name':var['country_name'],
            field:var[field]
        })
    context = {'data': result}
    return HttpResponse(json.dumps(context), content_type='application/json')

@csrf_exempt
def get_top_confirm(request):
    result = list()
    top = int(request.POST.get('top'))
    datalist = models.Country.objects.order_by("-confirm_total")[0:top]
    for var in datalist:
        result.append({
            'country_name':var.country_name,
            'confirm_total':var.confirm_total,
            'confirm_new':var.confirm_new,
            'confirm_current':var.confirm_current,
            'cured_total':var.cured_total,
            'cured_new':var.cured_new,
            'death_total':var.death_total,
            'death_new':var.death_new
        })
    context = {'data': result}
    return HttpResponse(json.dumps(context), content_type='application/json')

def get_total_comfirm(request):
    result = []
    datalist = models.Country.objects.values('country_name', 'confirm_total')
    for var in datalist:
        country_name = var['country_name']
        confirm_total = var['confirm_total']
        result.append({'name': country_name, 'value': confirm_total})
    context = {'data': result}
    return HttpResponse(json.dumps(context), content_type='application/json')
