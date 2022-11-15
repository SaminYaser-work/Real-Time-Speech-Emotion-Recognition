FROM nikolaik/python-nodejs:python3.8-nodejs16
# RUN apk add --no-cache python3 py3-pip
# RUN apt-get update || : && apt-get install python -y
# RUN apt-get update && apt-get install -y software-properties-common gcc && \
#     add-apt-repository -y ppa:deadsnakes/ppa
# RUN apt-get update && apt-get install -y python3.10 python3-distutils python3-pip python3-apt


# RUN apk add --no-cache libsndfile


RUN apt-get update -y && apt-get install -y --no-install-recommends build-essential gcc \
    libsndfile1 
WORKDIR /usr/src/app
COPY . .
RUN pip install -r requirements.txt

WORKDIR /usr/src/app/RTSER
RUN npm install
RUN npm run build

WORKDIR /usr/src/app
CMD python -m flask run