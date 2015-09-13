from flask import Flask
from flask import abort
from flask import render_template
from helpers import hp_data

app = Flask(__name__)

@app.route("/")
def index():
    template = 'index.html'
    return render_template(template)

@app.route('/company-overview/')
def overview_data():
    template = 'company_overview.html'
    object_list = hp_data.load_data()
    products_list = hp_data.dollars_by_product_service_code(object_list)
    recipient_city_list = hp_data.contracts_by_city(object_list)
    return render_template(template, object_list=object_list, products_list=products_list, recipient_city_list=recipient_city_list)

@app.route('/contract-list/')
def list_view():
    template = 'list_view.html'
    object_list = hp_data.load_data()
    products_list = hp_data.dollars_by_product_service_code(object_list)
    recipient_city_list = hp_data.contracts_by_city(object_list)
    return render_template(template, object_list=object_list, products_list=products_list, recipient_city_list=recipient_city_list)

@app.route('/contract-detail/')
def contract_view():
    template = 'contract_view.html'
    object_list = hp_data.load_data()
    products_list = hp_data.dollars_by_product_service_code(object_list)
    recipient_city_list = hp_data.contracts_by_city(object_list)
    return render_template(template, object_list=object_list, products_list=products_list, recipient_city_list=recipient_city_list)

@app.route('/glossary/')
def glossary():
    template = 'glossary.html'
    return render_template(template)

@app.route('/about-the-data/')
def about_the_data():
    template = 'about-the-data.html'
    return render_template(template)

@app.route('/search-tips/')
def search_tips():
    template = 'search-tips.html'
    return render_template(template)       











# OLD PAGE VIEWS

@app.route('/product/<product_id>/')
def contract_list(product_id):
    template = 'list.html'
    object_list = hp_data.load_data()
    products_list = hp_data.dollars_by_product_service_code(object_list)
    for p in products_list:
        if p[4] == product_id:
            object_list = [o for o in object_list if p[0] == o["ProductorServiceCode"]]
            return render_template(template, object_list=object_list)
    abort(404)

@app.route('/city/<city_id>/')
def list(city_id):
    template = 'geo-list.html'
    object_list = hp_data.load_data()
    cities_list = hp_data.contracts_by_city(object_list)
    for c in cities_list:
        if c[5] == city_id:
            object_list = [o for o in object_list if c[5] == o["RecipientCity"]]
            return render_template(template, object_list=object_list)
    abort(404)

@app.route('/product/<product_id>/<contract_id>/')
def product_contract(product_id, contract_id):
    template = 'contract.html'
    object_list = hp_data.load_data()
    record = [o for o in object_list if o['record_count'] == contract_id]
    return render_template(template, object=record)

@app.route('/city/<city_id>/<contract_id>/')
def city_contract(city_id, contract_id):
    template = 'contract.html'
    object_list = hp_data.load_data()
    record = [o for o in object_list if o['record_count'] == contract_id]
    return render_template(template, object=record)

if __name__ == '__main__':
    app.run(debug=True, use_reloader=True)
