import json

import pymongo
import jwt

from flask_cors import CORS
from flask import request, Flask, Response
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta


app = Flask(__name__)
cors = CORS(app)

# serverSelectionTimeoutMS defaults to 30 seconds
mongo = pymongo.MongoClient("mongodb://mongo:27017")
#mongo.server_info()
mongo.drop_database("SecureQuestionnaire") # clear collection after server restart 
DB = mongo["SecureQuestionnaire"]


# TODO: CS: get_collection obsolete if working with global constant DB??
# All collections created on first access
def get_questionnaires():
    return DB["questionnaires"]   


def get_user():
    return DB["user"]   


def get_RSA_public_keys():
    """
        Collection Structure

        RSAPublicKeys = {
            owner1@email.com: publicKey,
            ...
        }
    """
    return DB["RSAPublicKeys"] 


def get_encrypted_AES_keys():
    """
        Collection Structure

        encryptedAESKeys = [
            {
                keyID: CONCAT(queID, owner_mail),
                encryptedAESKey: someEncryptedAESKey
            },
            ...
        ]
    """
    return DB["encryptedAESKeys"] 


@app.route("/GET/<id>", methods=["GET"])
@token_required
def get(id):
    status = 200
    response = None

    try:
        fs = get_questionnaires()
    except Exception as e:
        return Response(response=repr(e), status=503, mimetype="application/json")

    try:
        data = json.loads(fs.get(id).read().decode("utf-8"))
        response = json.dumps(data)
    except Exception as e:
        response = repr(e)
        status = 404

    if not data:
        resp = {"msg": f"Error: key {id} not found"}
        status = 404

    return Response(response=response, status=status, mimetype="application/json")


@app.route("/POST/<id>", methods=["POST"])
@token_required
def post(id):
    status = 200
    response = None
    
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
        response = json.dumps(data)
    except Exception as e:
        response = repr(e)
        status = 409

    return Response(response=response, status=status, mimetype="application/json")


def token_required(f):
    @wraps(f)
    def _verify(*args, **kwargs):
        auth_headers = request.headers.get('Authorization', '').split()

        invalid_msg = {
            'message': 'Invalid token. Registeration and / or authentication required',
            'authenticated': False
        }
        expired_msg = {
            'message': 'Expired token. Reauthentication required.',
            'authenticated': False
        }

        if len(auth_headers) != 2:
            return Response(response=JSON.dumps(invalid_msg), status=401, mimetype="application/json")

        try:
            token = auth_headers[1]
            data = jwt.decode(token, current_app.config['SECRET_KEY'])
            user = get_user().find_one({"email": data["sub"]})

            if not user:
                raise RuntimeError('User not found')

            return f(user, *args, **kwargs)

        except jwt.ExpiredSignatureError:
            return Response(response=JSON.dumps(invalid_msg), status=401, mimetype="application/json")

        except (jwt.InvalidTokenError, Exception) as e:
            return Response(response=JSON.dumps(invalid_msg), status=401, mimetype="application/json")

    return _verify



def authenticate(email, password):
    users = get_user()

    hashed_password = generate_password_hash(
        password, 
        method="sha256"
    )

    if not email or not password:
        return None
    
    user = users.find_one({"email": email})

    # user not existent yet or password hash not matching
    if not user or not check_password_hash(user["password"], password):
        return None

    return user


@app.route("/api/register", methods=["PUT"])
def register():
    try:
        users = get_user()
    except Exception as e:
        return Response(response=repr(e), status=503, mimetype="application/json")

    users.insert_one({
        "email": request.args.get("email"),
        "password": generate_password_hash(
            request.args.get("password"), 
            method="sha256"
        )
    })
    
    return Response(status=201, mimetype="application/json")


@app.route("/api/login", methods=["PUT"])
def login():
    status = 200
    data = request.get_json()
    user = authenticate(data["email"], data["password"])

    if not user:
        response = {"msg": f"Error: Invalid credentials"}
        status = 400
    else:
        response = jwt.encode(
            {
                'sub': user["email"],
                'iat':datetime.utcnow(),
                'exp': datetime.utcnow() + timedelta(minutes=30)
            },
            current_app.config['SECRET_KEY']
        ).decode("UTF-8")

    return Response(response=json.dumps(response), status=status, mimetype="application/json")
    


@app.route("/api/questionnaire", methods=["GET", "PUT"])
@token_required
def questionnaire():
    status = 200

    try:
        db = get_questionnaires()
    except Exception as e:
        return Response(response=repr(e), status=503, mimetype="application/json")

    if request.method == "GET":
        queID = request.args.get("queID")
        data = db.find_one({"_id": queID})

        if not data:
            data = {"msg": f"Error: key {queID} not found"}
            status = 404

    elif request.method == "PUT":
        data = request.get_json()["questionnaire"]

        if not isinstance(data, dict):
            return Response(status=400)

        id = data["queID"]
        data["_id"] = id
        result = db.replace_one({"_id": id}, data)

        if result.matched_count == 0:
            db.insert_one(data)
            status = 201
    
    return Response(response=json.dumps(data), status=status, mimetype="application/json")


@app.route("/api/questionnaire/all", methods=["GET"])
@token_required
def all_questionnaires():
    status = 200

    try:
        db = get_questionnaires()
    except Exception as e:
        return Response(response=repr(e), status=503, mimetype="application/json")

    data = "["
    for dokument in dokumente:
        if "answers" not in dokument:
            data += str(dokument)
            data += ","

    data += "]"

    if not data:
        data = {"msg": f"Error: nothing found"}
        status = 404

    return Response(response=json.dumps(data), status=status, mimetype="application/json")


@app.route("/api/answers", methods=["GET", "PUT"])
@token_required
def answers():
    status = 200

    try:
        db = get_questionnaires()
    except Exception as e:
        return Response(response=repr(e), status=503, mimetype="application/json")

    # handle GET
    if request.method == "GET":
        queID = request.args.get("queID")
        data = db.find_one({"_id": queID})

        if not data:
            data = {"msg": f"Error: key {queID} not found"}
            status = 404

    # handle PUT
    elif request.method == "PUT":
        data = request.get_json()

        if not isinstance(data, dict):
            return Response(status=400)

        id = data["id"]
        data["_id"] = id
        result = db.replace_one({"_id": id}, data)

        if result.matched_count == 0:
            db.insert_one(data)
            status = 201

    return Response(response=json.dumps(data), status=status, mimetype="application/json")


@app.route("/api/questionnaire/idcheck", methods=["GET"])
@token_required
def check_id():
    status = 200

    try:
        db = get_questionnaires()
    except Exception as e:
        return Response(response=repr(e), status=503, mimetype="application/json")

    queID = request.args.get("queID")
    data = db.find_one({"_id": queID})

    if not data:
        resp = {"status": True}
    else:
        resp = {"status": False}

    return Response(response=json.dumps(resp), status=status, mimetype="application/json")


@app.route("/api/AESkeys", methods=["GET", "PUT"])
@token_required
def AESkeys():
    status = 200

    try:
        keys = get_encrypted_AES_keys()
    except Exception as e:
        return Response(response=repr(e), status=503, mimetype="application/json")
    

    if request.method == "GET":
        owner_mail = request.args.get("owner_mail")
        queID = request.args.get("queID")
        
        # match for nested document
        doc = keys.find_one({ "keyID": (queID + owner_mail) })
        del doc["_id"]  # remove non JSON serializable ObjectID value, not needed
        
        if not doc:
            key = {"msg": f"Error: No key for {owner_mail} found"}
            status=404
        else:
            key = doc["encryptedAESKey"]
            status = 200

        return Response(response=json.dumps(key), status=status, mimetype="application/json")
        

    elif request.method == "PUT":
        key_info = request.get_json()

        if not isinstance(key_info, dict):
            return Response(status=400)

        # Concat queID with email to create uniqe identifier for given questionnaire
        que = keys.find_one({ "keyID": (key_info["queID"] + key_info["owner_mail"]) })

        keys.insert_one(
            {
                "keyID": (key_info["queID"] + key_info["owner_mail"]),
                "encryptedAESKey": key_info["encryptedAESKey"]
            }
        )
        
        # Alternative structure with nested documents; prettiert but queries get much more complicated...
        # keys.insert_one({
        #     "queID": key_info.queID,
        #     "keys": [{
        #         "encryptedAESKey": key_info.encryptedAESKey,
        #         "owner_mail": key_info.owner_mail
        #     }]
        # })

    return Response(status=status, mimetype="application/json")


@app.route("/api/RSAkeys", methods=["GET", "PUT"])
@token_required
def RSAkeys():
    status = 200

    try:
        keys = get_RSA_public_keys()
    except Exception as e:
        return Response(response=repr(e), status=503, mimetype="application/json")
    

    if request.method == "GET":
        owner_mail = request.args.get("owner_mail")
        
        if owner_mail == "":
            # get all keys
            key = []

            for k in keys.find({}):
                del k['_id']  # remove non JSON serializable ObjectID value, not needed
                key.append(k)
        else:
            key = keys.find_one({"owner_mail": owner_mail})["publicKey"]

        if not key:
            key = {"msg": f"Error: No key for {owner_mail} found"}
            status=404
        else:
            status = 200

        print(key)

        return Response(response=json.dumps(key), status=status, mimetype="application/json")
        

    elif request.method == "PUT":
        # TODO: CS: Was wenn es die owner_mail bzw. den hinterlegten Fragebogen schon gibt???
        # z.b. bei wiederholtem Ausfuellen? dann .replace_one()?

        key_info = request.get_json()

        if not isinstance(key_info, dict):
            return Response(status=400)

        keys.insert_one(key_info)

    return Response(status=status, mimetype="application/json")


if __name__ == "__main__":
    app.run()
