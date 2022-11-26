import librosa
import trained_models.VGGish.predict as vggish
import trained_models.YAMNET.predict as yamnet
import trained_models.HuBERT.predict as hubert


def get_emo(path):
    y, sr = librosa.load(path, sr=16000)
    y, _ = librosa.effects.trim(y, top_db=25)

    if len(y) < 16000:
        y = librosa.util.fix_length(y, 16000)
        # return {
        #     "results": [
        #         {
        #             "name": "VGGish",
        #             "values": [0, 0, 0, 0, 0, 0, 0]
        #         },
        #         {
        #             "name": "HuBERT",
        #             "values": [0, 0, 0, 0, 0, 0, 0]
        #         }
        #     ]
        # }

    vggish_res = vggish.get_emotion(y, sr)
    yamnet_res = yamnet.get_emotion(y, sr)
    hubert_res = hubert.get_emotion(y, sr)
    # print(vggish_res)
    # print(hubert_res)

    return {
        "results": [vggish_res, yamnet_res, hubert_res]
    }
