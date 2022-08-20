from urllib.request import urlopen
import matplotlib.pyplot as plt
import librosa
import librosa.display
import skimage.io
import numpy as np
import io
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import load_img, img_to_array
from tensorflow.keras.applications.vgg16 import preprocess_input, decode_predictions

model = load_model('model.h5')
classes = ['Angry 😠', 'Disgust 🤮', 'Fear 😨', 'Happy 😃',
           'Neutral 😐', 'Pleasantly Surprised 😲', 'Sad 😭']


def get_emo():
    y, sr = librosa.load('./temp/audio.webm', res_type='kaiser_fast')
    mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=40)
    skimage.io.imsave('./temp/audio.png', mfccs)

    image = load_img(f'./temp/audio.png', target_size=(224, 224))
    image = img_to_array(image)
    image = image.reshape((1, image.shape[0], image.shape[1], image.shape[2]))
    image = preprocess_input(image)

    pred = model.predict(image)
    y_pred = np.argmax(pred, axis=1)
    print(y_pred)
    print(classes[y_pred[0]])
    return {'emotion': classes[y_pred[0]]}
