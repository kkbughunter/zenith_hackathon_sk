import RPi.GPIO as gp

gp.setmode(gp.BOARD)
gp.setup(22,gp.OUT)
gp.setup(18,gp.OUT)
gp.setup(16,gp.OUT)
gp.setup(15,gp.OUT)
gp.setup(13,gp.OUT)
gp.setup(7,gp.OUT)
gp.cleanup()
