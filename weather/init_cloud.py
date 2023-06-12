import firebase_admin as fba

with open("config.json") as f:
	x=eval(f.read())

path=x["firebase-api-file-path"]

url="https://weather-pi2app-default-rtdb.asia-southeast1.firebasedatabase.app"

cred=fba.credentials.Certificate(path)

def start_cloud():

	default_app=fba.initialize_app(cred, {"databaseURL": url})
	print("-->initiating firebase")
