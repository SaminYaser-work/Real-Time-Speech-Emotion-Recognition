from tensorflow.keras.models import load_model
import numpy as np
import librosa
import noisereduce as nr

TOP_DB = 30
TOTAL_LEGNTH = 208384
HOP_LEGNTH = 512

model = load_model('./models/subesco_original_final')


def get_emotion(data, sr):

    xt, _ = librosa.effects.trim(data, top_db=TOP_DB)

    if len(xt) > TOTAL_LEGNTH:
        print("Too long")
        return -1

    padded_x = np.pad(xt, (0, TOTAL_LEGNTH - len(xt)), 'constant')
    final = nr.reduce_noise(padded_x, sr)

    mel = librosa.feature.melspectrogram(
        y=final, sr=sr, n_mels=128, hop_length=HOP_LEGNTH)

    f_mel = np.asarray(mel).astype('float32')

    f_mel = np.expand_dims(f_mel, axis=0)
    f_mel = np.expand_dims(f_mel, -1)

    pred = model.predict(f_mel)
    print(pred)
    y_pred = np.argmax(pred, axis=1)
    print(y_pred)

    name = "SUBESCO"
    values = [round(x*100, 2) for x in pred[0]]

    return {
        "name": name,
        "values": values,
    }
