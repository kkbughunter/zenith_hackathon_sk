import api
import sensor
import cloud_management as cm
import datetime as dt

def decide(x=None):

	print("-->requesting sensor data")

	if sensor.sense():

		print("-->sensor : positive")

		global w_data

		if x==None:
			print("-->requesting weather api")
			w_data=api.weather()
		else:
			w_data=x

		now=dt.datetime.now()
		nowtime=str(now).split(" ")[1].split(".")[0]
		nowhour=nowtime.split(":")[0]
		today=w_data["rain"][str(now).split(" ")[0]]

		infolist=[]

		for i in today:
        		if i.split(":")[0]>=nowhour:
                		infolist.append(today[i])

		nextdate=now+dt.timedelta(days=1)
		nextday=w_data["rain"][str(nextdate).split(" ")[0]]

		for i in nextday:
			infolist.append(nextday[i])

		rlist=[]
		plist=[]

		for i in infolist:
			rlist.append(i[0])
			plist.append(i[1])

		print("-->making prediction based on weather")

		weight=0
		for i in range(8):
			j=rlist[i]
			k=plist[i]
			if j>0.2 and k>80:
				weight+=1

		print("-->making decision")

		if weight>1:
			print("-->decision : negative")
			cm.update_weather2server(w_data,False)
			return False
		else:
			print("-->decision : positive")
			cm.update_weather2server(w_data,True)
			return True
	else:
		print("-->sensor : nagetive")
		cm.update_weather2server(w_data,False)
		return False
