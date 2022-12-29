# Real Time Speech Emotion Recognition
Recognizes the emotion of the speaker in real time when spoken through a microphone. The emotion is classified in English and Bengali. Made with React, Flask, and Tensorflow.


## Usage
Install the dependencies using the following command:

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```
Then run the following command to start the application:
```bash
./start.sh
```
Visit `localhost:8000` to use the application.

## Docker
You can also use the docker image to run the application. You need to have docker installed on your system. Pull the image using the following command:

For Windows, install the Docker Desktop from [here](https://www.docker.com/products/docker-desktop).

Then start Docker Desktop and run the following commands:

```bash
docker pull fo0d/real_time_speech_emotion_recognition:latest
```

Then run the following command to start the application:
```bash
docker run -dp 8000:8000 fo0d/real_time_speech_emotion_recognition
```
The server needs a few seconds to spin up. After that, visit `localhost:8000` through your browser to use the system!

If 8000 is being used by another application, change the port number if you want to use a different port. For example, if you want to use port 5000, then run the following command:
```bash
docker run -dp 8000:5000 fo0d/real_time_speech_emotion_recognition
```


## Information
The following pre-trained models were fine-tuned for SER task:
- VGG16
- VGGish
- HuBERT

All the models are re-trained on the following datasets:
- English
  - TESS
  - RAVDESS
  - SAVEE
  - CREMA-D
- Bengali
  - SUBESCO
  - BSER

## References
If you use this code, please cite the following paper:

```bibtex
Coming soon...
```
