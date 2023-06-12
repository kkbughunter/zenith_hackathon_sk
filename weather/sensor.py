import RPi.GPIO as gp

gp.setmode(gp.BOARD)
gp.setup(11,gp.IN)

def sense():

	if not gp.input(11):
		return True
	else:
		return False
