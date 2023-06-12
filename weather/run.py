from multiprocessing import Process
import online
import polling
import auto
import offline

while True:
	if online.back_online():

		print("-->starting sub-process -auto-")

		x=Process(target=auto.start_auto)
		x.start()

		print("-->initiating polling")

		polling.pre_req()
		polling.init_poll()
		x.kill()
	else:
		y=Process(target=offline.start_offline)
		y.start()
		y.join()
