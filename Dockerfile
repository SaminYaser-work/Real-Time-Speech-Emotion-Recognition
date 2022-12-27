# FROM nikolaik/python-nodejs:python3.10-nodejs16
FROM python:3.10.9-buster

# RUN apk add --no-cache libsndfile


# Installing dependencies
RUN apt-get update -y && apt-get install -y --no-install-recommends build-essential gcc \
    libsndfile1 ffmpeg

WORKDIR /usr/src/app
COPY './RTSER/dist' './RTSER/dist'
COPY './temp' './temp'
COPY app.py .
COPY requirements.txt .
COPY main.py .
COPY './trained_models' './trained_models'
COPY './pypackages2' './pypackages'
RUN pip install --no-index --find-links pypackages -r requirements.txt
RUN pip install ffmpeg

# RUN mkdir pypackages
# RUN pip download -r requirements.txt -d pypackages
# RUN pip install -r requirements.txt

# CMD tail -f /dev/null
CMD python app.py