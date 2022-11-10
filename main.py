import librosa
import trained_models.VGGish.predict as vggish
import trained_models.HuBERT.predict as hubert


classes = ['Angry 😠', 'Disgust 🤮', 'Fear 😨', 'Happy 😃',
           'Neutral 😐', 'Pleasantly Surprised 😲', 'Sad 😭']


def get_emo(path):
    y, sr = librosa.load(path, sr=16000)

    vggish_res = vggish.get_emotion(y, sr)
    hubert_res = hubert.get_emotion(y, sr)
    print(vggish_res)
    print(hubert_res)

    return {
        "results": [vggish_res, hubert_res]
    }
