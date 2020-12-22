import csv
import json


if __name__ == "__main__":
    countries = {}

    with open('src\\data\\ramen-ratings.csv') as rd:
        ramens = csv.reader(rd, delimiter=',', quotechar='"')
        print(ramens.__next__())
        for row in ramens:
            country = row[4]
            top_10 = row[6]

            if not countries.get(country):
                countries.update({country: [0, 0]})
                
            countries[country][0] += 1

            if top_10:
                countries[country][1] += 1
        print(countries)
        rd.close()

    with open('src\\data\\combined_geo.json', 'w') as c_geo:
        with open('src\\data\\countries.json') as geo:
            keys = countries.keys()
            geo_data = json.load(geo)
            for feature in geo_data['features']:
                data = countries.get(feature['properties']['ADMIN']) or countries.get(feature['properties']['ISO_A3'])

                if data:
                    print(f"{feature['properties']['ADMIN']} or {feature['properties']['ISO_A3']} has found a match {data}")
                    feature['num_ramen'] = data[0]
                    feature['num_top_ten'] = data[1]
                    
                    try:
                        countries.pop(feature['properties']['ADMIN'])
                    except:
                        countries.pop(feature['properties']['ISO_A3'])
            
            print(countries)
            json.dump(geo_data, c_geo)

            c_geo.close()
            geo.close()
        
