from db import get_user

import json
from os import environ
from datetime import datetime, timedelta
from functools import wraps

import jwt
from flask import request, Response


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
            data = jwt.decode(token, environ.get('SECRET_KEY'), algorithms=["HS256"])
            user = get_user().find_one({ "owner_mail": data["sub"] })

            if not user:
                raise RuntimeError('User not found')

            return f(*args, **kwargs)

        except jwt.ExpiredSignatureError:
            return Response(response=json.dumps(invalid_msg), status=401, mimetype="application/json")

        except (jwt.InvalidTokenError, Exception) as e:
            return Response(response=json.dumps(invalid_msg), status=401, mimetype="application/json")

    return _verify
