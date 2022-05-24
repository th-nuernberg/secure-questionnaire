import os
import json
from flask import request, Flask, Response
import pymongo




app = Flask(__name__)

def get_db():

    try:

        mongodb_Url = 'mongodb://mongo:27017' 
        client = pymongo.MongoClient(mongodb_Url,
        serverSelectionTimeoutMS=600)
        client.server_info()
        db = client.database.data 
    except Exception as e:
        raise e
    
    return db



@app.route('/GET/<id>', methods=['GET'])
def get(id):

    try:
        db = get_db()
    except Exception as e:
        return Response(response=repr(e), status = 503, mimetype='application/json')




    data = db.find_one({'_id':id})
    if not data:
        resp = {'msg':f'Error: key {id} not found'}
        return Response(response=json.dumps(resp), status= 404, mimetype='application/json')

    return Response(response=json.dumps(data), status = 200, mimetype='application/json')

@app.route('/POST/<id>', methods=['POST'])
def post(id): 

    try:
        db = get_db()
    except Exception as e:
        return Response(response=repr(e), status = 503, mimetype='application/json')

    data = request.get_json()
    if not isinstance(data, dict):
        return Response( status = 400 )

    data['_id']=id

    try:
        db.insert_one(data)
    except Exception as e:
        return Response(response=repr(e), status = 409, mimetype='application/json')

    return Response(json.dumps(data), status = 200, mimetype='application/json')

@app.route('/PUT/<id>', methods=['PUT'])
def put(id): 

    try:
        db = get_db()
    except Exception as e:
        return Response(response=repr(e), status = 503, mimetype='application/json')

    data = request.get_json()
    if not isinstance(data, dict):
            return Response( status = 400 )


    data['_id']=id

    
    result = db.replace_one({'_id':id},data)

    if result.matched_count == 0:
        db.insert_one(data)
        return Response(json.dumps(data), status=201,  mimetype='application/json')
    
    return Response(json.dumps(data), status = 200, mimetype='application/json')


@app.route('/api/questionnaire', methods=['PUT'])
def putQuestionnaire(): 

    try:
        db = get_db()
    except Exception as e:
        return Response(response=repr(e), status = 503, mimetype='application/json')

    data = request.get_json()
    if not isinstance(data, dict):
            return Response( status = 400 )

    id = data['questionnaire']['queID']

    data['_id'] = id

    result = db.replace_one({'_id':id},data)

    if result.matched_count == 0:
        db.insert_one(data)
        return Response(json.dumps(data), status=201,  mimetype='application/json')
    
    return Response(json.dumps(data), status = 200, mimetype='application/json')


@app.route('/api/questionnaire', methods=['GET'])
def getQuestionnaire(): 
    try:
        db = get_db()
    except Exception as e:
        return Response(response=repr(e), status = 503, mimetype='application/json')

    queID = request.args.get('queID')

    data = db.find_one({'_id':queID})
    if not data:
        resp = {'msg':f'Error: key {queID} not found'}
        return Response(response=json.dumps(resp), status= 404, mimetype='application/json')

    return Response(response=json.dumps(data), status = 200, mimetype='application/json')

if __name__ == '__main__':
    app.run(host='0.0.0.0')