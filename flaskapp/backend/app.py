import json
from datetime import datetime, timedelta
from functools import wraps
from base64 import b64encode, b64decode

import jwt
import pymongo
from flask_cors import CORS
from flask import request, Flask, Response
from werkzeug.security import generate_password_hash, check_password_hash
from Crypto.Cipher import PKCS1_OAEP
from Crypto.PublicKey.RSA import construct
from Crypto.Hash import SHA256


app = Flask(__name__)
cors = CORS(app)

with open('config.json') as config_file:
    config = json.load(config_file)
    SECRET_KEY = config['SECRET_KEY']
    ADMIN_PASSWORD = config['ADMIN_PASSWORD']

# serverSelectionTimeoutMS defaults to 30 seconds
mongo = pymongo.MongoClient("mongodb://mongo:27017")
#mongo.server_info()
mongo.drop_database("SecureQuestionnaire") # clear collection after server restart 
DB = mongo["SecureQuestionnaire"]

DB["user"].insert_one({
    "owner_mail": "admin",
    "owner_name": "admin",
    "password": generate_password_hash(
        ADMIN_PASSWORD, 
        method="sha256"
    )
})


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


def token_required(f):
    @wraps(f)
    def _verify(*args, **kwargs):
        auth_headers = request.headers.get('Authorization', '').split()

        invalid_msg = {
            'message': 'Invalid token. Registration and / or authentication required',
            'authenticated': False
        }
        expired_msg = {
            'message': 'Expired token. Reauthentication required.',
            'authenticated': False
        }

        if len(auth_headers) != 2:
            return Response(response=json.dumps(invalid_msg), status=401, mimetype="application/json")

        try:
            token = auth_headers[1]
            data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            user = get_user().find_one({ "owner_mail": data["sub"] })

            if not user:
                raise RuntimeError('User not found')

            return f(*args, **kwargs)

        except jwt.ExpiredSignatureError:
            return Response(response=json.dumps(invalid_msg), status=401, mimetype="application/json")

        except (jwt.InvalidTokenError, Exception) as e:
            return Response(response=json.dumps(invalid_msg), status=401, mimetype="application/json")

    return _verify


@app.route("/api/verifyPassword", methods=["PUT"])
def verify_password():
    data = request.get_json()
    password_hash = get_user().find_one({ "owner_mail": data["owner_mail"] })["password"]

    if check_password_hash(
        password_hash, 
        data["password"]
    ):
        res = password_hash
        status = 200
    else:
        res = "Invalid password"
        status = 400

    return Response(response=json.dumps(res), status=status, mimetype="application/json")


@app.route("/api/userDetails", methods=["GET"])
def get_user_details():
    auth_headers = request.headers.get('Authorization', '').split()

    invalid_msg = {
        'message': 'Invalid token. Registration and / or authentication required',
        'authenticated': False
    }
    expired_msg = {
        'message': 'Expired token. Reauthentication required.',
        'authenticated': False
    }

    if len(auth_headers) != 2:
        return Response(response=json.dumps(invalid_msg), status=401, mimetype="application/json")

    try:
        token = auth_headers[1]
        data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        user = get_user().find_one({ "owner_mail": data["sub"] })

        if not user:
            raise RuntimeError('User not found')

        del user["_id"]  # remove non JSON serializable ObjectID value, not needed

        return Response(response=json.dumps(user), status=200, mimetype="application/json")

    except jwt.ExpiredSignatureError:
        return Response(response=json.dumps(invalid_msg), status=401, mimetype="application/json")

    except (jwt.InvalidTokenError, Exception) as e:
        return Response(response=json.dumps(invalid_msg), status=401, mimetype="application/json")


@app.route("/api/register", methods=["PUT"])
@token_required
def register():
    data = request.get_json()
    res = {}

    try:
        users = get_user()
    except Exception as e:
        return Response(response=repr(e), status=503, mimetype="application/json")

    if users.find_one({ "owner_mail": data["owner_mail"] }) and not data["replace"]:
        res["exists"] = True
        res["created_on"] = users.find_one({ "owner_mail": data["owner_mail"] })["created_on"]
        status = 200
    else:
        res["exists"] = False
        res["hashed_password"] = generate_password_hash(
            data["password"], 
            method="sha256"
        )

        user_details = {
            "owner_mail": data["owner_mail"],
            "owner_name": data["owner_name"],
            "password": res["hashed_password"],
            "created_on": datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        }

        if data["replace"]:
            users.replace_one(
                { "owner_mail": data["owner_mail"] },
                user_details
            )
        else:
            users.insert_one(user_details)

        status = 201
    
    return Response(response=json.dumps(res), status=status, mimetype="application/json")


@app.route("/api/verify", methods=["PUT"])
def verify_public_key():
    data = request.get_json()
    key = get_RSA_public_keys().find_one({"owner_mail": data["owner_mail"]})["publicKey"]

    # Verify client public key against DB
    # (compare spki representation TODO: directely write jwk to DB to avoid redundant transmission of spki in PUT)
    if key != data["spki_public_key"]:
        return Response(response=json.dumps({"msg": f"Error: Invalid credentials"}), status=400, mimetype="application/json")
    
    e = 65537  # AQAB
    n = int(data["jwk_public_key_exponent"])

    rsakey = construct((n, e), consistency_check=True)
    cipher = PKCS1_OAEP.new(rsakey, SHA256)
    challenge = cipher.encrypt(
        SHA256.new(
            (data["owner_mail"] + datetime.today().strftime("%m/%d/%Y")).encode() # Hash only takes byte strings
        ).hexdigest()[:10].encode()# Take first 10 characters, whole string too large (ValueError: Plaintext is too long.)
    ) 
    
    challenge = b64encode(challenge)

    # Alternativ 10 digit random nonce -> Muesste man sich aber merken oder plain mitschicken...
    # nonce = ''.join([str(random.randint(0, 9)) for i in range(10)])
    # Oder (ohne merken) aktuelle zeit auf minute gerundet: anmelde versuch zwischen 0 und 60 sekunden gueltig
    # IP oder sessionID schwierig...

    response = {
        # Encrypt secret to challenge client with
        "challenge": challenge.decode()
    }
    return Response(response=json.dumps(response), status=200, mimetype="application/json")


@app.route("/api/login", methods=["PUT"])
def login():
    data = request.get_json()

    # Non admin users have to provide a successful challenge (verify_public_key)
    if not data["owner_mail"] == "admin":
        secret = SHA256.new(
            (data["owner_mail"] + datetime.today().strftime("%m/%d/%Y")).encode() # Hash only takes byte strings
        ).hexdigest()[:10]


        if secret != data["secret"]:
            return Response(response=json.dumps({"msg": f"Error: Invalid credentials"}), status=400, mimetype="application/json")

    token = jwt.encode(
        {
            'sub': data["owner_mail"],
            'iat': datetime.utcnow(),
            'exp': datetime.utcnow() + timedelta(minutes=30)
        },
        SECRET_KEY,
        algorithm="HS256"
    )

    response = { "token": token }

    return Response(response=json.dumps(response), status=200, mimetype="application/json")
    

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

        return Response(response=json.dumps(key), status=status, mimetype="application/json")
        
    elif request.method == "PUT":
        key_info = request.get_json()

        if not isinstance(key_info, dict):
            return Response(status=400)

        keys.insert_one(key_info)

    return Response(status=status, mimetype="application/json")


if __name__ == "__main__":
    app.run()
