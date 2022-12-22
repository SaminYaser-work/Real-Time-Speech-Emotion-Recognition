import librosa
import numpy as np
from datetime import datetime
import soundfile as sf
import trained_models.VGGish.predict as vggish
# import trained_models.YAMNET.predict as yamnet
import trained_models.HuBERT.predict as hubert
from timeit import default_timer as timer


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
            "name": "Meta Model",
            "values": neutral
        }
    ]
}

placeholder = {
    "name": "Placeholder",
    "values": neutral
}


def get_emo(path):
    start = timer()

    y, sr = librosa.load(path, sr=16000)
    avg_rms = librosa.feature.rms(y=y).mean()
    if avg_rms < 0.01:
        return silence

    vggish_res = vggish.get_emotion(y, sr)
    hubert_res = hubert.get_emotion(y, sr)

    end = timer()
    with open('logs.txt', 'a') as f:
        f.write(f'{end - start}\n')

    # get current time
    time = datetime.now().strftime("%H:%M:%S").replace(':', '.')
    vggish_emo = np.argmax(vggish_res['values'])
    hubert_emo = np.argmax(hubert_res['values'])
    filename = f'{time}_{vggish_emo}_{hubert_emo}'
    sf.write(f'./runs/{filename}.wav', y, sr)

    # Meta Model
    # meta_values = hubert_res['values']
    # meta_values[vggish_emo] += 5.0
    # meta_res = {
    #     'name': 'Meta Model',
    #     'values': meta_values
    # }

    res = {
        "results": [vggish_res, hubert_res, placeholder]
    }

    # print(res)

    return res
