import requests

#authorization
signin_headers = {'Content-Type': 'application/x-www-form-urlencoded'}
signin_data = {"username": "adminadmin", "password": "adminadmin"}
r = requests.post("http://localhost:8000/auth/signin", data=signin_data, headers=signin_headers)
print(r)
if r.status_code != 200:
    print("Signin failed")
    exit(1)
token = r.json()["access_token"]
auth_headers = {"Authorization": f"Bearer {token}"}

def getMovieDirector(id):
    return_string = ""
    response = requests.get(f"https://api.imdbapi.dev/titles/{id}")
    try:
      if response.status_code >= 200 and response.status_code < 300:
          film_dict = response.json()
          if film_dict:
              if film_dict["directors"]:
                directors = film_dict["directors"]
                for director in directors:
                  return_string += director["displayName"]
                  return return_string
    except:
      return "No data"

def getMovieDetails():
    #checking for duplicates
    existing_films_response = requests.get("http://localhost:8000/films", headers=auth_headers)
    if existing_films_response.status_code != 200:
        print("Failed to fetch existing films")
        return
    existing_films = existing_films_response.json()
    existing_titles_years = {(f["title"], f["year"]) for f in existing_films}

    #handling data from api and adding the films to the db
    response = requests.get("https://api.imdbapi.dev/titles")
    if response.status_code >= 200 and response.status_code < 300:
        films_dict = response.json()
        if films_dict:
            for film in films_dict["titles"]:
                title = film["primaryTitle"]
                description = film["plot"]
                poster_url = film["primaryImage"]["url"]
                year = film["startYear"]
                if (title, year) in existing_titles_years:
                    print(f"Duplicate found for {title} ({year}), skipping")
                    continue
                film_directors = getMovieDirector(film["id"])
                film_data = {"poster_url": poster_url, "title": title, "description": description, "creator": film_directors, "year": year}
                r = requests.post("http://localhost:8000/films", json=film_data, headers=auth_headers)

getMovieDetails()
