import RPi.GPIO as gp
import init_cloud as ic
import cloud_db as db
import time
import decision
import cloud_management as cm
from func_timeout import func_timeout, FunctionTimedOut

with open("config.json") as f:
	x=eval(f.read())

poll_delay=x["polling-interval"]

pump_ctrl_pin=x["w_pump-pin"]
mode_ctrl_switch_pin=x["local-mode-control-switch-pin"]
pump_switch_pin=x["local-w_pump-switch-pin"]
override_pin=x["local-override-status-pin"]
auto_pin=x["auto-mode-status-pin"]
manual_pin=x["manual-mode-status-pin"]

def pre_req():

	try:
		func_timeout(12,ic.start_cloud)
	except:
		pass

	try:
		func_timeout(12,db.init_db)

		r=db.ref_statuses

	except:
		print("-->conection lost @ polloing-starting cloud & database")
		return 0 #

	global override
	global automatic

	override=''
	automatic=''

	try:
		automatic=r.child("auto").get()
		override=r.child("override").get()

	except FunctionTimedOut:
		print("-->conection lost @ auto & override updation")
		return 0 #

	else:
		if override==None:
			override=0
			r.update({"override":0})
		if automatic==None:
			automatic=1
			r.update({"automatic":1})


def init_poll():
	print("-->polling started")

	try:
		func_timeout(12,ic.start_cloud)
	except:
		pass

	try:
		func_timeout(12,db.init_db)

		r=db.ref_statuses

		connect=db.ref_statuses.child("connection")

		func_timeout(12,connect.update,args=({"b":1, "f":0},))

	except:
		print("-->conection lost @ polloing-starting cloud & database")
		return 0 #


	gp.setmode(gp.BOARD)
	gp.setup(pump_ctrl_pin,gp.OUT)
	#gp.output(7,False)
	gp.setup(pump_switch_pin,gp.IN)
	gp.setup(mode_ctrl_switch_pin,gp.IN)
	gp.setup(auto_pin,gp.OUT)
	gp.setup(manual_pin,gp.OUT)
	gp.setup(override_pin,gp.OUT)

	prev_state=1

	old_override=0
	activate=0
	while True:

		mode_switch_state=gp.input(mode_ctrl_switch_pin)
		time.sleep(poll_delay)
		print('-->polling')
		try:
			data=func_timeout(12,r.get)
		except:
			print("-->connection lost-polling-get_statuses")
			return 0

		if ( (not data["auto"]) and data["w_pump"] and (not data["override"]) ):
			gp.output(pump_ctrl_pin,True)
		elif (not data["auto"] and (not data["override"])):
			gp.output(pump_ctrl_pin,False)

		if data["auto"]:
			gp.output(auto_pin,1)
			gp.output(manual_pin,0)
		else:
			gp.output(manual_pin,1)
			gp.output(auto_pin,0)

		if data["override"]:

			if data["override"]!=old_override:
				print("-->override enabled")

			gp.output(override_pin,1)

			if mode_switch_state!=gp.input(mode_ctrl_switch_pin) and (not activate):
				print("-->local manual control switch is enabled in online mode")
				activate=1

			mide_switch_state=gp.input(mode_ctrl_switch_pin)

			if (gp.input(mode_ctrl_switch_pin)==0 and activate) or (not activate):
				r.update({"auto":1})		# 0 --> auto @ switches
				gp.output(auto_pin,1)
				gp.output(manual_pin,0)

			if gp.input(mode_ctrl_switch_pin)==1 and activate:		# manual mode enabled

				gp.output(manual_pin,1)
				gp.output(auto_pin,0)

				if gp.input(pump_switch_pin)==0:
					gp.output(pump_ctrl_pin,1)
					r.update({"auto":0,"w_pump":1})
				else:
					gp.output(pump_ctrl_pin,0)
					r.update({"auto":0,"w_pump":0})

		else:
			gp.output(override_pin,0)
			activate=0

			if old_override!=data["override"]:
				print("-->override disabled")

		old_override=data["override"]

		state=data["auto"]

		if ((state==1) and (prev_state==0)):

			print("-->shifting to automating mode")

			try:
				decided=func_timeout(12, decision.decide)
				gp.output(pump_ctrl_pin,decided)
				#cm.update_weather2server()
			except:
				print("-->connection lost-manual2auto")
				return 0

		elif ((state==0) and (prev_state==1)):
			print("-->shifting to manual mode")

		prev_state=state


		#----connection status------
		try:
			cpl=not func_timeout(12,connect.child("f").get)
			func_timeout(12,connect.update,args=({"b": int(cpl)},))
		except:
			print("-->connection lost @ connection updates")
			return 0
