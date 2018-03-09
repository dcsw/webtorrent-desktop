FROM benjamin94/apprtc-docker
MAINTAINER Dean Cirielli

# ENV SHARED_KEY FILL_KEY_IN
# ENV TURN_IP FILL_TURN_IP_IN
# ENV TURN_PORT FILL_TURN_PORT_IN

# RUN apt-get update -y

# RUN apt-get install -y wget

# # Google App Engine and Python 2.7
# ENV GAE_VER 1.9.23
# ENV GAE_ZIP go_appengine_sdk_linux_amd64-$GAE_VER.zip

# RUN apt-get update && \
#     apt-get install --yes \
#         unzip \
# 	python

# ADD https://storage.googleapis.com/appengine-sdks/featured/$GAE_ZIP .
# RUN unzip -q $GAE_ZIP -d /usr/local
# RUN rm $GAE_ZIP
# ENV PATH $PATH:/usr/local/go_appengine/

# RUN apt-get install python2.7 python-pil -y
# RUN apt-get install python-webtest -y

# RUN apt-get install -y nodejs
# RUN apt-get install -y npm
# RUN ln -s /usr/bin/npm /usr/local/bin/npm
# # NodeJS
# RUN wget -O nodejs.sh https://deb.nodesource.com/setup_4.x
# RUN chmod +x nodejs.sh
# RUN bash ./nodejs.sh

# # symlink nodejs to node
# RUN ln -s -f /usr/bin/nodejs /usr/bin/node

# RUN apt-get install -y python-pip python-dev build-essential
# RUN pip install --upgrade pip
# RUN pip install --upgrade virtualenv
# RUN pip install requests

# # Install Java
# RUN apt-get install -y default-jre

# Install & configure haproxy
# Create pem file like this:
#   openssl genrsa -out key.pem 2048
#   cat mvapprtc-ssh-answers.txt | openssl req -new -x509 -key key.pem -out cert.pem -days 1095
#   cat key.pem cert.pem > mvapprtc.pem
#   ... or ....
#   cat mvapprtc-ssh-answers.txt | openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout mvapprtc.key -out mvapprtc.crt
#   cat mvapprtc.crt mvapprtc.key > mvapprtc.pem
ADD mvapprtc.pem /etc/ssl/private/mvapprtc.pem
RUN apt-get install -y haproxy
ADD haproxy.cfg /etc/haproxy/haproxy.cfg
RUN apt-get install -y rsyslog
RUN echo '$ModLoad imudp' >> /etc/rsyslog.conf
RUN echo '$UDPServerRun 514' >> /etc/rsyslog.conf

# GIT
# RUN apt-get install -y git
# RUN git clone https://github.com/BenjaminFaal/apprtc

# EXPOSE 80
# EXPOSE 8080
EXPOSE 9175

# COPY . apprtc
# WORKDIR apprtc

# # RUN npm install -g npm
# RUN npm install -g npm@4.6.1
# RUN npm install -g grunt-cli

# RUN npm install
# RUN grunt build

# Add utils
#RUN apt-get install -y curl

COPY run.sh /

WORKDIR /
RUN chmod +x /run.sh
CMD /run.sh

# Override src dir in apprtc w/host's src dir for dev purposes
VOLUME [ "/apprtc/src" ]