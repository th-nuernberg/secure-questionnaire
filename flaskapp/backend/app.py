from api import api

from flask_cors import CORS
from flask import Flask

# TODO: Create Documentation
# https://www.sphinx-doc.org/en/master/usage/quickstart.html

app = Flask(__name__)
cors = CORS(app)

app.register_blueprint(api)

if __name__ == "__main__":
    app.run()
