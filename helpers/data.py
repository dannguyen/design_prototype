import json
import operator
import os
import requests
import re

DATA_PATH = os.path.join(os.path.dirname(__file__), '../static/data/sampleHPdata.json')
def load_data():
    with open(DATA_PATH) as f:
        d = json.loads(f.read())
    return d['usaspendingSearchResults']['result']['doc']

# CLEAN AGENCY FIELD
def clean_officeID(hpdata):
    for h in hpdata:
        office = h['contractingOfficeID']
        return re.sub(r"\\d+", "", office)


def contracts_by_agency(hpdata):
    agencies = {}
    for h in hpdata:
        agency = h['AgencyID']
        contract_amount = float(h['obligatedAmount'])
        if agency in agencies:
            agencies[agency] += contract_amount
        else:
            agencies[agency] = contract_amount
    return agencies


###################################################
# CONTRACTS BY RECIPIENT CITY

def contracts_by_city(hpdata):
    recipient_city = []
    cities = []
    for h in hpdata:

        if 'city' in h and 'state' in h: 
            city_state = str(h['city'] + ", " + h['state'])
        elif 'city' in h and 'state' not in h:
            city_state = str(h['city'])
        elif 'city' not in h and 'state' in h:
            city_state = str(h['state'])
        else:
            print 'NULL'

        ident = h['city']
        contract_amount = int(float(h['obligatedAmount']))
        if city_state not in cities:
            recipient_city.append([city_state, contract_amount, 1, 'x', 'y', ident])
            cities.append(city_state)
        else:
            for r in recipient_city:
                if r[0] == city_state:
                    r[1] += contract_amount
                    r[2] += 1

    recipient_city = sorted(recipient_city, key=operator.itemgetter(1), reverse=True)
    

    # GEOCODING
    # maps_url = 'https://maps.googleapis.com/maps/api/geocode/json?'
    # for r in recipient_city:
    #     atts = {'address': r[0], 'key': 'AIzaSyDdBsQKgsXLrHAil_feh5RK_g5lyxbRmAU'}
    #     resp = requests.get(maps_url, params = atts)
    #     data = resp.json()
    #     r[3] = data['results'][0]['geometry']['location']['lat']
    #     r[4] = data['results'][0]['geometry']['location']['lng']

    # return recipient_city


###################################################


# DOLLARS OBLIGATED BY FISCAL YEAR

###################################################
# DOLLARS OBLIGATED BY PRODUCTS OR SERVICE CODE
def dollars_by_product_service_code(hpdata):
    products_code = []
    codes = []
    for h in hpdata:
        if 'productOrServiceCode' in h:
            code = h['productOrServiceCode']
        else:
            print 'NULL'    
        contract_amount = int(float(h['obligatedAmount']))
        if code not in codes:
            products_code.append([code, contract_amount, 1, 'width', 'id'])
            codes.append(code)
        else:
            for p in products_code:
                if p[0] == code:
                    p[1] += contract_amount
                    p[2] += 1

    products_code = sorted(products_code, key=operator.itemgetter(1), reverse=True)

    # TO GET BAR WIDTH IN CHART
    unit = products_code[0][1] / 100

    for p in products_code:
        width = p[1] / unit
        p[3] = width * 2
        ident = p[0].split(':')
        ident = ident[0]
        p[4] = ident

    return products_code
