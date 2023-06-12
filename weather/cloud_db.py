from firebase_admin import db
import json

with open("config.json") as f:
	user=eval(f.read())["user"]

def init_db():

	print("-->initiating database")

	global ref
	global ref_statuses
	global ref_field_geo_data

	ref=db.reference('/').child(user)
	ref_statuses=ref.child("statuses")
	ref_field_geo_data=ref.child("field_geo_data")
