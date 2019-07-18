# Vige, Home of Professional Open Source Copyright 2010, Vige, and
# individual contributors by the @authors tag. See the copyright.txt in the
# distribution for a full listing of individual contributors.
# Licensed under the Apache License, Version 2.0 (the "License"); you may
# not use this file except in compliance with the License. You may obtain
# a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

FROM node:10

# Install app dependencies

ENV DEBIAN_FRONTEND noninteractive
ENV TERM xterm

RUN apt-get upgrade -y && \
	apt-get update && \
	apt-get install dialog apt-utils -y && \
	apt-get install sudo && \
	echo "%adm ALL=(ALL) NOPASSWD: ALL" >> /etc/sudoers && \
	useradd -u 1001 -G users,adm -d /home/votinguser --shell /bin/bash -m votinguser && \
	echo "votinguser:secret" | chpasswd

USER votinguser

# Create app directory
WORKDIR /workspace
COPY / /workspace/project
# If you are building your code for production
RUN sudo chown -R votinguser:users /workspace && \
    cd /workspace/project && npm install && \
    npm ci --only=production && \
    npm run build && \
    sudo npm install -g https-serve && \
    sudo mkdir -p /root/.https-serve/ && \
    sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout server.key -out server.crt -subj "/C=GB/ST=London/L=London/O=Global Security/OU=IT Department/CN=Vige" && \
    sudo mv server.key server.crt /root/.https-serve && \
    mv /workspace/project/build/* /workspace && \
    rm -Rf /workspace/project

EXPOSE 443
CMD sudo https-serve -s build && tail -f /dev/null