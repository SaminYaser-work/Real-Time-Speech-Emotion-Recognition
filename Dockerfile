FROM nikolaik/python-nodejs:python3.10-nodejs16
# RUN apk add --no-cache python3 py3-pip
# RUN apt-get update || : && apt-get install python -y
# RUN apt-get update && apt-get install -y software-properties-common gcc && \
#     add-apt-repository -y ppa:deadsnakes/ppa
# RUN apt-get update && apt-get install -y python3.10 python3-distutils python3-pip python3-apt


# RUN apk add --no-cache libsndfile


# Installing dependencies
RUN apt-get update -y && apt-get install -y --no-install-recommends build-essential gcc \
    libsndfile1 

# Copying build files
# WORKDIR /usr/src/app
# COPY . .
# RUN pip install -r requirements.txt

# WORKDIR /usr/src/app/RTSER
# RUN npm install
# RUN npm run build

WORKDIR /usr/src/app
COPY './RTSER/dist' './RTSER/dist'
COPY app.py .
COPY requirements.txt .
COPY main.py .
COPY './trained_models' './trained_models'
COPY './pypackages' './pypackages'
# RUN pip install -r requirements.txt
RUN pip install --no-index --find-links pypackages -r requirements.txt

CMD python app.py