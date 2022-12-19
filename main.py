import librosa
import trained_models.VGGish.predict as vggish
import trained_models.YAMNET.predict as yamnet
import trained_models.HuBERT.predict as hubert
from timeit import default_timer as timer


weights = {
    'vggish': 0.5061122987605159,
    'hubert': 0.8652093632169002
}


def get_emo(path):
    y, sr = librosa.load(path, sr=16000)
    # y, _ = librosa.effects.trim(y, top_db=25)

    # if len(y) < 16000:
    #     y = librosa.util.fix_length(y, 16000)

    vggish_res = vggish.get_emotion(y, sr)
    # yamnet_res = yamnet.get_emotion(y, sr)
    hubert_res = hubert.get_emotion(y, sr)

    wa = []
    a = []

    for i in range(7):
        fwa = (
            (vggish_res['values'][i] * weights['vggish']) +
            (hubert_res['values'][i] * weights['hubert'])
        ) / (weights['vggish'] + weights['hubert'])

        fa = (vggish_res['values'][i] + hubert_res['values'][i]) / 2

        wa.append(fwa)
        a.append(fa)

    # Average
    meta_res = {
        'name': 'Meta Model',
        'values': a
    }

    print(wa, '\n', a)

    return {
        "results": [vggish_res, hubert_res, meta_res]
    }
