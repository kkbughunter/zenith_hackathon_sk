import requests
from datetime import datetime, timedelta
import json

with open("config.json") as f:
	x=eval(f.read())

location_coord=x["location_coord"]
#"12.980,77.590"
#"12.750480,80.198933"

key=x["visual-crossing-weather-api-key"]

def weather():
	now=str(datetime.now())
	now=now.split(' ')
	date=now[0]
	time=now[1].split('.')[0]

	next_date=datetime.today()+timedelta(days=1)
	next_date=str(next_date)
	next_date=next_date.split(' ')[0]

	now_date_time={"date":date, "time":time}

	url="https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/"+location_coord+"/"+date+"/"+next_date+"?unitGroup=metric&key="+key

	print("-->calling api")
	data=requests.get(url,timeout=10)

	data_text=data.text

	print("-->preparing data from api")

	data_dict=eval((data_text).replace("null","\"-\""))

	temp=data_dict["days"]
	rain_dict=dict()
	for i in temp:
		rain_dict[i["datetime"]]=dict()
		for j in i["hours"]:
	  		rain_dict[i["datetime"]][j["datetime"]]=[j["precip"],j["precipprob"]]

	filtered_dict=dict()
	filtered_dict["temp"]=data_dict["currentConditions"]["temp"]
	filtered_dict["rain"]=rain_dict
	filtered_dict["updated_time"]=now_date_time

	return filtered_dict
