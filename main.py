import librosa
import numpy as np
from datetime import datetime
import soundfile as sf
import trained_models.VGGish.predict as vggish
# import trained_models.VGG16.predict as vgg16
import trained_models.HuBERT.predict as hubert
from collections import Counter
from timeit import default_timer as timer

# log = os.environ.get('LOG', False)
# TODO: Change this to False in production
log = False


# neutral class for silent clips
neutral = [0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0]
silence = {
    "results": [
        {
            "name": "VGGish",
            "values": neutral
        },
        {
            "name": "HuBERT",
            "values": neutral
        },
        {
            "name": "VGG16",
            "values": neutral
        },
        # {
        #     "name": "Meta",
        #     "values": neutral
        # }
    ]
}

placeholder = {
    "name": "Placeholder",
    "values": neutral
}


def get_emo(path):

    global log

    if log:
        start = timer()

    y, sr = librosa.load(path, sr=16000)
    avg_rms = librosa.feature.rms(y=y).mean()
    if avg_rms < 0.01:
        return silence

    vggish_res = vggish.get_emotion(y, sr)
    # vgg16_res = vgg16.get_emotion(y, sr)
    hubert_res = hubert.get_emotion(y, sr)

    vggish_emo = np.argmax(vggish_res['values'])
    # vgg16_emo = np.argmax(vgg16_res['values'])
    hubert_emo = np.argmax(hubert_res['values'])

    # Meta Model (Voting)
    # counts = Counter([vgg16_emo, vggish_emo, hubert_emo])
    # m = counts.most_common()
    # meta_values = [0.0] * 7
    # if m[0][1] == m[1][1]:
    #     meta_values[hubert_emo] = 100.0
    # else:
    #     meta_values[m[0][1]] = 100.0
    # meta_res = {
    #     'name': 'Meta',
    #     'values': meta_values
    # }

    res = {
        "results": [vggish_res, hubert_res, placeholder]
    }

    if log:
        end = timer()
        with open('logs.txt', 'a') as f:
            f.write(f'{end - start}\n')
        # time = datetime.now().strftime("%H:%M:%S").replace(':', '.')
        # filename = f'{time}_{vggish_emo}_{vgg16_emo}_{hubert_emo}_{np.argmax(meta_values)}'
        # filename = f'{time}_{vggish_emo}_{vgg16_emo}_{hubert_emo}'
        # sf.write(f'./runs/{filename}.wav', y, sr)

    return res
