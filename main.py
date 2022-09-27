import librosa
# import librosa.display
# import skimage.io
import numpy as np
from tensorflow.keras.models import load_model
import subesco_original
import resnet_sadhin
# from tensorflow.keras.preprocessing.image import load_img, img_to_array
# from tensorflow.keras.applications.vgg16 import preprocess_input
# import tensorflow
# tensorflow.get_logger().setLevel('ERROR')


classes = ['Angry 😠', 'Disgust 🤮', 'Fear 😨', 'Happy 😃',
           'Neutral 😐', 'Pleasantly Surprised 😲', 'Sad 😭']


def mfcc(data, sample_rate, n_mfcc=40):
    # mfcc = np.mean(librosa.feature.mfcc(
    #     y=data, sr=sample_rate, n_mfcc=n_mfcc).T, axis=0)
    mfcc = librosa.feature.mfcc(
        y=data, sr=sample_rate, n_mfcc=n_mfcc).T
    return mfcc


def chroma(data, sample_rate):
    stft = np.abs(librosa.stft(data))
    # chroma_stft = np.mean(librosa.feature.chroma_stft(
    #     S=stft, sr=sample_rate).T, axis=0)
    chroma_stft = librosa.feature.chroma_stft(
        S=stft, sr=sample_rate).T
    return chroma_stft


def melSpectogram(y, sr):
    # mel = np.mean(librosa.feature.melspectrogram(
    #     y=y, sr=sr).T, axis=0)
    mel = librosa.feature.melspectrogram(
        y=y, sr=sr).T
    return mel


def zcr(y):
    zcr = np.mean(librosa.feature.zero_crossing_rate(y=y).T, axis=0)
    return zcr


def rms(y):
    rms = np.mean(librosa.feature.rms(y=y).T, axis=0)
    return rms


def cnnBig_prediction(data, sample_rate):
    cnnBig = load_model('./models/cnnBig')
    feature = np.array([])

    # feature = np.hstack((feature, chroma(data, sample_rate)))
    # feature = np.hstack((feature, mfcc(data, sample_rate)))
    # feature = np.hstack((feature, melSpectogram(data, sample_rate)))

    f1 = chroma(data, sample_rate)
    print(f1.shape)
    f2 = mfcc(data, sample_rate)
    print(f2.shape)
    f3 = melSpectogram(data, sample_rate)
    print(f3.shape)

    feature = np.concatenate((f1, f2, f3), axis=1)

    print(feature.shape)

    feature = np.expand_dims(feature, axis=0)
    print(feature.shape)

    # feature = np.expand_dims(feature, axis=1)
    # print(feature.shape)
    # feature = np.expand_dims(feature, axis=2)
    # print(feature.shape)
    feature = np.swapaxes(feature, 0, 2)
    print(feature.shape)

    # pred = cnnBig.predict(feature)
    # y_pred = np.argmax(pred, axis=1)
    # return classes[y_pred[0]]


# def vgg16_prediction(y, sr):
#     vgg16 = load_model('model.h5')
#     mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=40)
#     skimage.io.imsave('./temp/audio.png', mfccs)

#     image = load_img(f'./temp/audio.png', target_size=(224, 224))
#     image = img_to_array(image)
#     image = image.reshape((1, image.shape[0], image.shape[1], image.shape[2]))
#     image = preprocess_input(image)

#     pred = vgg16.predict(image)
#     y_pred = np.argmax(pred, axis=1)

#     return classes[y_pred[0]]


def get_emo():
    y, sr = librosa.load('./temp/audio.wav')
    # y, sr = librosa.load('sounds/YAF_burn_angry.wav', sr=None)

    subesco = subesco_original.get_emotion(y, sr)
    resnet = resnet_sadhin.get_emotion(y, sr)

    # cnnBig_res = cnnBig_prediction(y, sr)

    res = {
        "results": [subesco, resnet]
    }

    return res
