"""Data Mining
"""
import json
import requests

def get_countries_codename():
    """
        get countries name
    """
    with open('static/json/isoCodeName.json', 'r') as read:
        data = json.load(read)
    return data

continent_name = {'北美洲':'North America', '非洲':'Africa', '南美洲':'South America', '亚洲':'Asia', '欧洲':'Europe', '大洋洲':'Oceania'}

def get_global_data():
    response = requests.get('https://cdn.mdeer.com/data/yqstaticdata.js?callback=callbackstaticdata')
    response = response.text.replace('callbackstaticdata(', '')
    response = response.rstrip(')')
    data = json.loads(response)
    ChineseData = data['country']
    foreignData = data['abroadSum']
    globalData = {
        'confirm_total':ChineseData['totalConfirmed']+foreignData['totalConfirmed'],
        'confirm_current':ChineseData['currentConfirm']+foreignData['currentConfirm'],
        'death_total':ChineseData['totalDeath']+foreignData['totalDeath'],
        'cured_total':ChineseData['totalCured']+foreignData['totalCured'],
        'confirm_new':ChineseData['lastIncData']['incrConfirm']+foreignData['lastIncData']['incrConfirm'],
        'death_new':ChineseData['lastIncData']['incrDeath']+foreignData['lastIncData']['incrDeath'],
        'cured_new':ChineseData['lastIncData']['incrCured']+foreignData['lastIncData']['incrCured']
    }
    return globalData

def get_normal_data():
    continents_name = {'北美洲':'North America', '非洲':'Africa', '南美洲':'South America', '亚洲':'Asia', '欧洲':'Europe', '大洋洲':'Oceania'}
    country_code_name = get_countries_codename()
    global_data = list()
    response = requests.get('https://cdn.mdeer.com/data/yqstaticdata.js?callback=callbackstaticdata')
    response = response.text.replace('callbackstaticdata(', '')
    response = response.rstrip(')')
    data = json.loads(response)
    continents_data = data['continentDataList']
    for continent in continents_data:
        if continent['continentName'] != '其他':
            countries_data = continent['countriesData']
            countries_list = list()
            for country in countries_data:
                if '(' not in country['childStatistic']:
                    if country['childStatistic'] == '中国':
                        country_data = {
                            'countryName':'China',
                            'isoCode':'CN',
                            'totalConfirm':country['totalConfirmed'],
                            'addConfirm':country['lastIncData']['incrConfirm'],
                            'nowConfirm':country['currentConfirm'],
                            'totalHeal':country['totalCured'],
                            'addHeal':country['lastIncData']['incrCured'],
                            'totalDead':country['totalDeath'],
                            'addDead':country['lastIncData']['incrDeath']
                        }
                    elif country['isoCode'] in country_code_name:
                        country_data = {
                            'countryName':country_code_name[country['isoCode']],
                            'isoCode':country['isoCode'],
                            'totalConfirm':country['totalConfirmed'],
                            'addConfirm':country['lastIncData']['incrConfirm'],
                            'nowConfirm':country['currentConfirm'],
                            'totalHeal':country['totalCured'],
                            'addHeal':country['lastIncData']['incrCured'],
                            'totalDead':country['totalDeath'],
                            'addDead':country['lastIncData']['incrDeath']
                        }
                    countries_list.append(country_data)
            global_data.append({
                'continent':continents_name[continent['continentName']],
                'currentConfirmed':continent['currentConfirmed'],
                'totalConfirmed':continent['totalConfirmed'],
                'totalCured':continent['totalCured'],
                'totalDeath':continent['totalDeath'],
                'country':countries_list
            })
    return global_data
