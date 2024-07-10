# from flask_cors import CORS
from flask import Flask
from werkzeug.middleware.proxy_fix import ProxyFix

from api import api

app = Flask(__name__)

app.config['PREFERRED_URL_SCHEME'] = 'https'

app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1 ,x_proto=1)
app.register_blueprint(api)

if __name__ == "__main__":
    app.run()
