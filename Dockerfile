FROM python:3.10.9-buster


# Installing dependencies
RUN apt-get update -y && apt-get install -y --no-install-recommends build-essential gcc \
    libsndfile1 ffmpeg

# Setting up working directory
WORKDIR /usr/src/app

# Copying files
COPY './RTSER/dist' './RTSER/dist'
COPY './temp' './temp'
COPY app.py .
COPY requirements.txt .
COPY main.py .
COPY './trained_models' './trained_models'
COPY './pypackages2' './pypackages'

# Installing packages
RUN pip install --no-index --find-links pypackages -r requirements.txt
RUN pip install ffmpeg

# Cleaning up
RUN rm -rf pypackages
RUN rm -rf './trained_models/VGG16'

# Running the app
CMD python app.py