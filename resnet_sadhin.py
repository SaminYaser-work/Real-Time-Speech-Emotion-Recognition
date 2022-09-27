import librosa
import matplotlib.pyplot as plt
from tensorflow.keras.models import load_model
import numpy as np
import librosa
import noisereduce as nr


def create_image(data, sr):

    mfccs = librosa.feature.mfcc(
        y=data, sr=sr, n_fft=2048, hop_length=512, n_mfcc=13)

    fig, ax = plt.subplots(1, figsize=(2, 2))
    mfcc_image = librosa.display.specshow(mfccs, ax=ax, sr=sr, y_axis='linear')
    ax.axes.get_xaxis().set_visible(False)
    ax.axes.get_yaxis().set_visible(False)
    ax.set_frame_on(False)
    plt.jet()
    fig.savefig(f'./temp/image.png')
    plt.figure().clear()
    plt.close()
    plt.cla()
    plt.clf()


def get_emotion(data, sr):

    create_image(data, sr)

    pred = model.predict('./temp/image.png')
    # print(pred)
    y_pred = np.argmax(pred, axis=1)
    # print(y_pred)

    name = "RESNET50_SADHIN"
    values = [round(x*100, 2) for x in pred[0]]

    return {
        "name": name,
        "values": values,
    }
