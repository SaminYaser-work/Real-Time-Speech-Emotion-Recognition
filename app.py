from flask_cors import CORS
from flask import Flask, request, json, render_template
import main


app = Flask(__name__, static_url_path='',
            static_folder='RTSER/dist', template_folder='./RTSER/dist')
CORS(app)  # comment this on deployment


@app.route("/")
def index():
    return render_template('index.html')


@app.route("/get-emo", methods=['POST'])
def get_emo():
    try:
        data = request.files['audio']
        data.save('./temp/audio.wav')
        res = main.get_emo()
        print(res)  # For debugging
        return app.response_class(response=json.dumps(res), status=200, mimetype='application/json')
    except Exception as e:
        print('Error in server:', str(e))
        return app.response_class(response=json.dumps(e), status=500, mimetype='application/json')


if __name__ == '__main__':
    app.run(host='localhost', debug=True, port=8000, use_reloader=True)
