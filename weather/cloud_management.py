import init_cloud
import cloud_db
import api
import decision
import RPi.GPIO as gp
import sensor
import polling

def update_weather2server(w_data=None, decided=None):

	try:
		init_cloud.start_cloud()
	except:
		pass
	finally:
		cloud_db.init_db()

		if w_data==None:
			print("-->weather update requested without data")
			filtered_dict=api.weather()
		else:
			print("-->weather update requested with data")
			filtered_dict=w_data

		if decided==None:
			decided=decision.decide(filtered_data)

		rlist=[]
		plist=[]

		rain_dict=filtered_dict["rain"]

		print("-->preparing data for server")

		for i in rain_dict:
			for j in rain_dict[i]:
				rlist.append(rain_dict[i][j][0])
				plist.append(rain_dict[i][j][1])

		gp.setmode(gp.BOARD)
		gp.setup(7,gp.OUT)

		polling.pre_req()

		print("-->updating server")

		cloud_db.ref_field_geo_data.update({"rain_list":rlist, "probability_list":plist})
		cloud_db.ref.child("info").update({"temp":filtered_dict["temp"], "updated_time":filtered_dict["updated_time"]})
		cloud_db.ref_statuses.update({"override":polling.override,"auto":polling.automatic,"weather":int(decided), "w_pump":int(decided), "sensor":int(sensor.sense())})

		print("-->server updated successfully")
