import firebase_admin as fba
from firebase_admin import db
import json

path="weather-pi2app-firebase-adminsdk-caw7m-7ab5ea968e.json"

url="https://weather-pi2app-default-rtdb.asia-southeast1.firebasedatabase.app"

cred=fba.credentials.Certificate(path)

default_app=fba.initialize_app(cred, {"databaseURL": url})

ref=db.reference('/')

data={"states":{ "motor":0, "sensor":0, "weather":0}}

data_json=json.dumps(data)

ref.set(data_json)