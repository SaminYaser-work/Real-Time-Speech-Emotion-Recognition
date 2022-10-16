import librosa
import numpy as np
import trained_models.VGGish.predict as vggish


classes = ['Angry 😠', 'Disgust 🤮', 'Fear 😨', 'Happy 😃',
           'Neutral 😐', 'Pleasantly Surprised 😲', 'Sad 😭']


def get_emo(path):
    y, sr = librosa.load(path, sr=16000)

    vggish_res = vggish.get_emotion(y, sr)

    return {
        "results": vggish_res
    }
