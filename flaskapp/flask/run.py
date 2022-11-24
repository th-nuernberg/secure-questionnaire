import os
import json
from flask import request, Flask, Response
import pymongo, gridfs
from flask_cors import CORS

app = Flask(__name__)
cors = CORS(app)

def get_db():

    try:

        mongodb_Url = 'mongodb://mongo:27017' 
        #mongodb_Url = 'localhost:27017'
        client = pymongo.MongoClient(mongodb_Url,
        serverSelectionTimeoutMS=600)
        client.server_info()
        db = client.database.data
        # fs = gridfs.GridFS(db)
    except Exception as e:
        raise e
    
    return db



@app.route('/GET/<id>', methods=['GET'])
def get(id):

    try:
        fs = get_db()
    except Exception as e:
        return Response(response=repr(e), status = 503, mimetype='application/json')

    
    try:
        data = json.loads(fs.get(id).read().decode('utf-8'))
    except Exception as e:
        return Response(response=repr(e), status = 404, mimetype='application/json')
    
    if not data:
        resp = {'msg':f'Error: key {id} not found'}
        return Response(response=json.dumps(resp), status= 404, mimetype='application/json')

    return Response(response=json.dumps(data), status = 200, mimetype='application/json')

@app.route('/POST/<id>', methods=['POST'])
def post(id): 

    try:
        fs = get_db()
    except Exception as e:
        return Response(response=repr(e), status = 503, mimetype='application/json')

    data = request.get_json()
    if not isinstance(data, dict):
        return Response( status = 400 )

    data['_id']=id
    
    try:
        fs.put(json.dumps(data), _id=id, encoding="ascii")
    except Exception as e:
        print(e)
        return Response(response=repr(e), status = 409, mimetype='application/json')

    return Response(json.dumps(data), status = 200, mimetype='application/json')






@app.route('/api/questionnaire', methods=['PUT'])
def putQuestionnaire(): 

    try:
        db = get_db()
    except Exception as e:
        return Response(response=repr(e), status = 503, mimetype='application/json')

    data = request.get_json()['questionnaire']
    if not isinstance(data, dict):
            return Response( status = 400 )

    id = data['queID']

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


@app.route('/api/answers', methods=['GET'])
def getAnswers(): 
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


@app.route('/api/answers', methods=['PUT'])
def putAnswers(): 

    try:
        db = get_db()
    except Exception as e:
        return Response(response=repr(e), status = 503, mimetype='application/json')

    data = request.get_json()
    if not isinstance(data, dict):
            return Response( status = 400 )

    id = data['id']

    data['_id'] = id

    result = db.replace_one({'_id':id},data)

    if result.matched_count == 0:
        db.insert_one(data)
        return Response(json.dumps(data), status=201,  mimetype='application/json')
    
    return Response(json.dumps(data), status = 200, mimetype='application/json')


@app.route('/api/questionnaire/idcheck', methods=['GET'])
def checkID(): 
    try:
        db = get_db()
    except Exception as e:
        return Response(response=repr(e), status = 503, mimetype='application/json')

    queID = request.args.get('queID')

    data = db.find_one({'_id':queID})
    if not data:
        resp = {'status': True}
        return Response(response=json.dumps(resp), status= 200, mimetype='application/json')
    else:
        resp = {'status': False}


if __name__ == '__main__':
    app.run(host='0.0.0.0')