import bs4, requests, json, xmltodict

base_url = 'https://www.usaspending.gov/fpds/fpds.php?detail=c&max_records=10'

response = requests.get(base_url + query)

print json.dumps(xmltodict.parse(response.text), indent=4)
