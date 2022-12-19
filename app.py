from flask_cors import CORS
from flask import Flask, request, json, render_template
import main
from waitress import serve


app = Flask(__name__, static_url_path='',
            static_folder='RTSER/dist', template_folder='./RTSER/dist')
CORS(app)  # comment this on deployment

# audio_file_path = './temp/audio.wav'
audio_file_path = './temp/audio.webm'


@app.route("/")
def index():
    return render_template('index.html')


@app.route("/get-emo", methods=['POST'])
def get_emo():
    try:
        data = request.files['audio']
        data.save(audio_file_path)
        # start = timer()
        res = main.get_emo(audio_file_path)
        # end = timer()
        # print('Time taken:', end - start)
        return app.response_class(response=json.dumps(res), status=200, mimetype='application/json')
    except Exception as e:
        print('Error in server:', str(e))
        return app.response_class(response=json.dumps(e), status=500, mimetype='application/json')


if __name__ == '__main__':
    # app.run(host='localhost', debug=True, port=8000, use_reloader=True)
    serve(app, host='0.0.0.0', port=8000, threads=4)
