import pymongo
from os import environ
from werkzeug.security import generate_password_hash


# serverSelectionTimeoutMS defaults to 30 seconds
mongo = pymongo.MongoClient("mongodb://mongo:27017")
#mongo.server_info()
#mongo.drop_database("SecureQuestionnaire") # clear collection after server restart 
DB = mongo["SecureQuestionnaire"]

DB["user"].insert_one({
    "owner_mail": "admin",
    "owner_name": "admin",
    "password": generate_password_hash(
        environ.get('ADMIN_PASSWORD'),
        method="sha256"
    )
})

# All collections created on first access
def get_questionnaires():
    return DB["questionnaires"]   

def get_responses():
    return DB["responses"]

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
