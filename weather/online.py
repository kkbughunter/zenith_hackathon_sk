import requests
import RPi.GPIO as gp

gp.setmode(gp.BOARD)
gp.setup(13,gp.OUT)
gp.setup(15,gp.OUT)

gp.output(13,0)
gp.output(15,0)

def back_online():

	print("-->checking connection status")

	try:
		x=requests.get("http://clients3.google.com/generate_204", timeout=10)
	except:
		print("-->system is offline")
		gp.output(13,1)
		gp.output(15,0)
		return False
	else:
		print("-->system is online")
		gp.output(15,1)
		gp.output(13,0)
		return True
