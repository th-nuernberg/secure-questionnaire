import json
import pymongo
from flask_cors import CORS
from flask import request, Flask, Response


app = Flask(__name__)

# TODO: CS: this will be needed for CORS to allow requests outside from the app itself -> phone browser when scanning QR-code from camera app 
# Enable CORS
#CORS(app, resources={r'/*': {'origins': '*'}})

CORS(app)

# Create MongoDB on server start
mongo = pymongo.MongoClient("localhost", 27017,serverSelectionTimeoutMS=600)
#mongo.server_info()
DB = mongo["SecureQuestionnaire"]


# TODO: CS: get_collection obsolete if working with global constant DB??
def get_questionnaires():
    return DB["questionnaires"]  # created on first access 


def get_public_keys():
    return DB["publicKeys"]  # created on first access 


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
def put_questionnaire():
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
def get_questionnaire():
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
def get_all_questionnaire():
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
def get_answers():
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
def put_answers():
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

@app.route('/api/keys', methods=['GET'])
def get_key():
    email = request.args.get("email")

    try:
        keys = get_public_keys()
    except Exception as e:
        return Response(response=repr(e), status=503, mimetype="application/json")

    public_key = keys.find_one({"email": email})["public_key"]

    if not public_key:
        resp = {"msg": f"Error: No key for {email} found"}
        return Response(response=json.dumps(resp), status=404, mimetype="application/json")

    return Response(response=json.dumps(public_key), status=200, mimetype="application/json")


@app.route("/api/keys", methods=["PUT"])
def put_key():
    key_info = request.get_json()["key_info"]

    if not isinstance(data, dict):
        return Response(status=400)

    try:
        keys = get_public_keys()
    except Exception as e:
        return Response(response=repr(e), status=503, mimetype="application/json")

    keys.insert_one(key_info)

    return Response(json.dumps(key_info), status=200, mimetype="application/json")


@app.route("/api/questionnaire/idcheck", methods=["GET"])
def check_id():
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


# Sanity check
@app.route("/", methods=["GET"])
def index():
    return "Hello there."

# Sanity check
@app.route("/ping", methods=["GET"])
def pong():
    return "pong!"

  
if __name__ == "__main__":
    app.run()
