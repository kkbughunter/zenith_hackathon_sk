import RPi.GPIO as gp
import time
import sensor
import online
from multiprocessing import Process

global online_status
online_status=0

def local_controls():

	print("-->local controls started")

	gp.setmode(gp.BOARD)
	gp.setup(7,gp.OUT)
	#gp.output(7,sensor.sense())
	gp.setup(8,gp.IN)
	gp.setup(10,gp.IN)

	gp.setup(16,gp.OUT)
	gp.setup(18,gp.OUT)

	gp.output(16,0)
	gp.output(18,0)    # expect problem

	enable=0
	state=gp.input(10)
	count=120
	while True:
		time.sleep(1)

		if state!=gp.input(10) and (not enable):
			print("-->local manual control switch is enabled")
			enable=1

		if (gp.input(10)==0 and enable) or (not enable):
			gp.output(16,1)
			gp.output(18,0)
			count+=1
			print(count,"counts")
			if count>=120:
				gp.output(7,sensor.sense())
				count=0

		if gp.input(10)==1 and enable:
			gp.output(16,0)
			gp.output(18,1)

			if gp.input(8)==0:
				gp.output(7,1)
			else:
				gp.output(7,0)

		if online_status==1:
			print("-->quiting offline local controls")
			return  # no shared memory allocated for multiprocessing so it wont work


def start_offline():

	print("-->initiating offline protocols")

	gp.setmode(gp.BOARD)
	#gp.setup(7,gp.OUT)
	#gp.output(7,sensor.sense())
	#gp.setup(8,gp.IN)
	#gp.setup(10,gp.IN)

	gp.setup(13,gp.OUT)
	gp.setup(15,gp.OUT)

	gp.output(13,1)
	gp.output(15,0)

	global online_status
	online_status=0

	control=Process(target=local_controls,daemon=True)
	control.start()

	while True:
		time.sleep(5)    #
		if online.back_online():
			online_status=1
			return 0
