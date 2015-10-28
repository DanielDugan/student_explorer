FROM python:2.7

RUN apt-get update

RUN apt-get --no-install-recommends install --yes libldap2-dev libsasl2-dev

RUN apt-get --no-install-recommends install --yes nodejs npm \
    && ln -s /usr/bin/nodejs /usr/bin/node
RUN npm install -g bower

WORKDIR /tmp/
COPY requirements.txt /tmp/
RUN pip install -r requirements.txt
RUN pip install gunicorn

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY . /usr/src/app

WORKDIR /usr/src/app/sespa
RUN bower --allow-root install
WORKDIR /usr/src/app

EXPOSE 80
CMD gunicorn --workers=2 --access-logfile=- --error-logfile=- --log-level=info --bind=0.0.0.0:80 student_explorer.wsgi:application