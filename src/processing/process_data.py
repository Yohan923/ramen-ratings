import csv
import json


if __name__ == "__main__":
    countries = {}
    world = {
        'num_ramen': 0,
        'num_top_10': 0,
        'stars': [],
        'packagings': {},
        'top_10s': [],
        'brands': {}
    }

    with open('src\\data\\ramen-ratings.csv') as rd:
        ramens = csv.reader(rd, delimiter=',', quotechar='"')
        print(ramens.__next__())
        for row in ramens:
            country = row[4]
            top_10 = row[6]
            brand = row[1]
            variety = row[2]
            stars = row[5]
            packaging = row[3]

            if not countries.get(country):
                countries.update({country: {
                    'num_ramen': 0,
                    'num_top_10': 0,
                    'stars': [],
                    'packagings': {},
                    'top_10s': [],
                    'brands': {}
                }})
                
            countries[country]['num_ramen'] += 1

            if top_10:
                countries[country]['num_top_10'] += 1
                countries[country]['top_10s'].append({'Brand': brand, 'Variety': variety, 'Stars': stars})
                world['num_top_10'] += 1
                world['top_10s'].append({'Brand': brand, 'Variety': variety, 'Stars': stars})

            if not countries[country]['packagings'].get(packaging):
                countries[country]['packagings'].update({
                    packaging: {
                        'name': packaging,
                        'num': 0,
                        'total_stars': 0,
                        'average': 0
                    }
                })
            
            if not world['packagings'].get(packaging):
                world['packagings'].update({
                    packaging: {
                        'name': packaging,
                        'num': 0,
                        'total_stars': 0,
                        'average': 0
                    }
                })


            if not countries[country]['brands'].get(brand):
                countries[country]['brands'].update({
                    brand: {
                        'name': brand,
                        'num': 0,
                        'total_stars': 0,
                        'average': 0
                    }
                })
            
            if not world['brands'].get(brand):
                world['brands'].update({
                    brand: {
                        'name': brand,
                        'num': 0,
                        'total_stars': 0,
                        'average': 0
                    }
                })

            countries[country]['packagings'][packaging]['num'] += 1
            countries[country]['packagings'][packaging]['total_stars'] += float(stars)
            world['packagings'][packaging]['num'] += 1
            world['packagings'][packaging]['total_stars'] += float(stars)

            countries[country]['brands'][brand]['num'] += 1
            countries[country]['brands'][brand]['total_stars'] += float(stars)
            world['brands'][brand]['num'] += 1
            world['brands'][brand]['total_stars'] += float(stars)
            
            countries[country]['stars'].append(float(stars))
            world['stars'].append(float(stars))
        print(countries)
        rd.close()
    
    for packaging in world['packagings'].values():
        packaging['average'] = round(packaging['total_stars'] / packaging['num'], 2)

    for country in countries.values():
        for packaging in country['packagings'].values():
            packaging['average'] = round(packaging['total_stars'] / packaging['num'], 2)

    for brand in world['brands'].values():
        brand['average'] = round(brand['total_stars'] / brand['num'], 2)

    for country in countries.values():
        for brand in country['brands'].values():
            brand['average'] = round(brand['total_stars'] / brand['num'], 2)

    with open('src\\data\\country_data.json', 'w') as hs:

        countries.update({
            'world': world
        })
        
        print(countries)
        json.dump(countries, hs)

        hs.close()


    with open('src\\data\\combined_geo.json', 'w') as c_geo:
        with open('src\\data\\countries.json') as geo:
            keys = countries.keys()
            geo_data = json.load(geo)
            for feature in geo_data['features']:
                data = countries.get(feature['properties']['ADMIN']) or countries.get(feature['properties']['ISO_A3'])

                if data:
                    print(f"{feature['properties']['ADMIN']} or {feature['properties']['ISO_A3']} has found a match {data}")
                    feature['num_ramen'] = data['num_ramen']
                    feature['num_top_ten'] = data['num_top_10']
                    
                    try:
                        countries.pop(feature['properties']['ADMIN'])
                    except:
                        countries.pop(feature['properties']['ISO_A3'])
            
            print(countries)
            json.dump(geo_data, c_geo)

            c_geo.close()
            geo.close()
        
