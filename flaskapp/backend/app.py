import json
import pymongo
from flask_cors import CORS
from flask import request, Flask, Response


app = Flask(__name__)

# TODO: CS: this will be needed for CORS to allow requests outside from the app itself -> phone browser when scanning QR-code from camera app 
# Enable CORS
CORS(app, resources={r'/*': {'origins': '*'}})

# Create MongoDB on server start
mongo = pymongo.MongoClient("localhost", 27017,serverSelectionTimeoutMS=600)
#mongo.server_info()
DB = mongo["SecureQuestionnaire"]


# TODO: CS: get_collection obsolete if working with global constant DB??
def get_questionnaires():
    return DB["questionnaires"]  # created on first access 


def get_public_keys():
    return DB["publicKeys"]  # created on first access 

# sanity check route
@app.route('/ping', methods=['GET'])
def ping_pong():
    return 'pong!'

@app.route("/GET/<id>", methods=["GET"])
def get(id):
    try:
        fs = get_questionnaires()
    except Exception as e:
        return Response(response=repr(e), status=503, mimetype="application/json")

    try:
        data = json.loads(fs.get(id).read().decode("utf-8"))
    except Exception as e:
        return Response(response=repr(e), status=404, mimetype="application/json")

    if not data:
        resp = {"msg": f"Error: key {id} not found"}
        return Response(
            response=json.dumps(resp), status=404, mimetype="application/json"
        )

    return Response(response=json.dumps(data), status=200, mimetype="application/json")


@app.route("/POST/<id>", methods=["POST"])
def post(id):
    try:
        fs = get_questionnaires()
    except Exception as e:
        return Response(response=repr(e), status=503, mimetype="application/json")

    data = request.get_json()
    if not isinstance(data, dict):
        return Response(status=400)

    data["_id"] = id

    try:
        fs.put(json.dumps(data), _id=id, encoding="ascii")
    except Exception as e:
        print(e)
        return Response(response=repr(e), status=409, mimetype="application/json")

    return Response(json.dumps(data), status=200, mimetype="application/json")


@app.route("/api/questionnaire", methods=["PUT"])
def putQuestionnaire():
    try:
        db = get_questionnaires()
    except Exception as e:
        return Response(response=repr(e), status=503, mimetype="application/json")

    data = request.get_json()["questionnaire"]
    if not isinstance(data, dict):
        return Response(status=400)

    id = data["queID"]

    data["_id"] = id

    result = db.replace_one({"_id": id}, data)

    if result.matched_count == 0:
        db.insert_one(data)
        return Response(json.dumps(data), status=201, mimetype="application/json")

    return Response(json.dumps(data), status=200, mimetype="application/json")


@app.route("/api/questionnaire", methods=["GET"])
def getQuestionnaire():
    try:
        db = get_questionnaires()
    except Exception as e:
        return Response(response=repr(e), status=503, mimetype="application/json")

    queID = request.args.get("queID")

    data = db.find_one({"_id": queID})
    if not data:
        resp = {"msg": f"Error: key {queID} not found"}
        return Response(
            response=json.dumps(resp), status=404, mimetype="application/json"
        )

    return Response(response=json.dumps(data), status=200, mimetype="application/json")


@app.route("/api/questionnaire/all", methods=["GET"])
def getAllQuestionnaire():
    try:
        db = get_questionnaires()
    except Exception as e:
        return Response(response=repr(e), status=503, mimetype="application/json")

    dokumente = db.find()

    s = "["
    for dokument in dokumente:
        if "answers" not in dokument:
            s += str(dokument)
            s += ","

    s += "]"

    data = s
    if not data:
        resp = {"msg": f"Error: nothing found"}
        return Response(
            response=json.dumps(resp), status=404, mimetype="application/json"
        )

    return Response(response=json.dumps(data), status=200, mimetype="application/json")


@app.route("/api/answers", methods=["GET"])
def getAnswers():
    try:
        db = get_questionnaires()
    except Exception as e:
        return Response(response=repr(e), status=503, mimetype="application/json")

    queID = request.args.get("queID")

    data = db.find_one({"_id": queID})
    if not data:
        resp = {"msg": f"Error: key {queID} not found"}
        return Response(
            response=json.dumps(resp), status=404, mimetype="application/json"
        )

    return Response(response=json.dumps(data), status=200, mimetype="application/json")


@app.route("/api/answers", methods=["PUT"])
def putAnswers():
    try:
        db = get_questionnaires()
    except Exception as e:
        return Response(response=repr(e), status=503, mimetype="application/json")

    data = request.get_json()
    if not isinstance(data, dict):
        return Response(status=400)

    id = data["id"]

    data["_id"] = id

    result = db.replace_one({"_id": id}, data)

    if result.matched_count == 0:
        db.insert_one(data)
        return Response(json.dumps(data), status=201, mimetype="application/json")

    return Response(json.dumps(data), status=200, mimetype="application/json")

@app.route("/api/pubKey", methods=["PUT"])
def putPubKey():
    data = request.get_json()
    email = request.args.get("email")

    if not isinstance(data, dict):
        return Response(status=400)
    
    try:
        db = get_public_keys()
    except Exception as e:
        return Response(response=repr(e), status=503, mimetype="application/json")

    result = db.replace_one({"email": email}, data)

    if result.matched_count == 0:
        db.insert_one(data)
        return Response(json.dumps(data), status=201, mimetype="application/json")

    return Response(json.dumps(data), status=200, mimetype="application/json")


@app.route("/api/pubKey", methods=["GET"])
def getPubKey():
    email = request.args.get("email")

    try:
        db = get_public_keys()
    except Exception as e:
        return Response(response=repr(e), status=503, mimetype="application/json")

    data = db.find_one({"email": email})

    if not data:
        resp = {"msg": f"Error: key {email} not found"}
        return Response(
            response=json.dumps(resp), status=404, mimetype="application/json"
        )

    return Response(response=json.dumps(data), status=200, mimetype="application/json")


@app.route("/api/questionnaire/idcheck", methods=["GET"])
def checkID():
    try:
        db = get_questionnaires()
    except Exception as e:
        return Response(response=repr(e), status=503, mimetype="application/json")

    queID = request.args.get("queID")

    data = db.find_one({"_id": queID})
    if not data:
        resp = {"status": True}
        return Response(
            response=json.dumps(resp), status=200, mimetype="application/json"
        )
    else:
        resp = {"status": False}


if __name__ == "uwsgi_file_app":
    app.run(host="0.0.0.0")
