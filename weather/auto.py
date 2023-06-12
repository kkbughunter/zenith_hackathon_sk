import RPi.GPIO as gp
import init_cloud as ic
import cloud_db as db
import decision
import time
import time
from func_timeout import func_timeout, FunctionTimedOut

with open("config.json") as f:
	x=eval(f.read())

delay=x["automatic-check-interval"]

def start_auto():

	print("-->sub-process -auto- started")

	try:
		ic.start_cloud()
	except:
		pass

	try:
		db.init_db()
		auto=db.ref_statuses.child("auto")
		override=db.ref_statuses.child("override")
	except:
		print("-->connection lost -auto- @ starting database\nexiting")
		exit()

	gp.setmode(gp.BOARD)
	gp.setup(7,gp.OUT)
	gp.setup(8,gp.IN)
	gp.setup(10,gp.IN)

	#gp.output(7,auto and decision.decide())

	i=0
	while True:
		time.sleep(delay)
		try:
			Auto=func_timeout(12, auto.get)	# override controls are detected from cloud
			if (Auto):                     # updated from polling
				decided=func_timeout(12,decision.decide)
				gp.output(7,decided)

		except:
			print("-->connetion lost - auto")
			print("-->exiting -auto-")
			exit()		#
		else:
			i+=1
