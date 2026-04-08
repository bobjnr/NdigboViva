import csv
import json
import os

BASE_DIR = 'dropdown data/Diaspora Current Location Information'
OUTPUT_FILE = 'src/lib/diaspora-location-data.json'

def read_csv(filename):
    filepath = os.path.join(BASE_DIR, filename)
    if not os.path.exists(filepath):
        print(f"Warning: {filepath} not found.")
        return []
    with open(filepath, mode='r', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        return [{k: (v.strip() if v else v) for k, v in row.items()} for row in reader]

def process():
    data = {
        "continents": [],
        "subContinents": {},
        "countries": {},
        "firstLevel": {},
        "secondLevel": {},
        "cities": {},
        "citizenship": []
    }

    # Continents
    for row in read_csv('Continent.csv'):
        data["continents"].append({"id": row["continent_id"], "name": row["continent_name"]})

    # Sub-continents
    for row in read_csv('Sub-continent.csv'):
        cid = row["continent_id"]
        if cid not in data["subContinents"]:
            data["subContinents"][cid] = []
        data["subContinents"][cid].append({"id": row["sub_continent_id"], "name": row["sub_continent_name"]})

    # Countries
    for row in read_csv('Country of Residence.csv'):
        sid = row["sub_continent_id"]
        if sid not in data["countries"]:
            data["countries"][sid] = []
        data["countries"][sid].append({
            "id": row["country_id"], 
            "name": row["country_name"],
            "continentId": row["continent_id"]
        })

    # First-Level Admin
    for row in read_csv('First-Level Administrative Division.csv'):
        cid = row["country_id"]
        if cid not in data["firstLevel"]:
            data["firstLevel"][cid] = []
        data["firstLevel"][cid].append({
            "id": row["first_level_admin_division_id"], 
            "name": row["first_level_admin_division_name"],
            "type": row.get("division_type", "")
        })

    # Second-Level Admin
    for row in read_csv('Second-Level Administrative Division.csv'):
        fid = row["first_level_admin_division_id"]
        if fid not in data["secondLevel"]:
            data["secondLevel"][fid] = []
        data["secondLevel"][fid].append({
            "id": row["second_level_admin_division_id"], 
            "name": row["second_level_admin_division_name"],
            "type": row.get("division_type", "")
        })

    # Cities
    for row in read_csv('City-Town.csv'):
        fid = row.get("first_level_admin_division_id")
        cid = row.get("country_id")
        if not cid: continue
        
        # Group by FLAD if available, else group by COUNTRY_
        key = fid if fid else f"COUNTRY_{cid}"
        if key not in data["cities"]:
            data["cities"][key] = []
        data["cities"][key].append({
            "id": row["city_town_id"], 
            "name": row["city_town_name"]
        })

    # Citizenship Status
    for row in read_csv('Citizenship Status.csv'):
        status_name = row.get("citizenship_status_name")
        if status_name:
            data["citizenship"].append(status_name)

    # Write JSON to public/data
    OUTPUT_FILE = 'public/data/diaspora-location-data.json'
    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, separators=(',', ':'))

    print(f"Successfully generated {OUTPUT_FILE}")

if __name__ == "__main__":
    process()
