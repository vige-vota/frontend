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

RUN apt-get upgrade -y && \
	apt-get update && \
	apt-get install apt-utils -y && \
	apt-get install sudo && \
	echo "%adm ALL=(ALL) NOPASSWD: ALL" >> /etc/sudoers && \
	useradd -u 1001 -G users,adm -d /home/votinguser --shell /bin/bash -m votinguser && \
	echo "votinguser:secret" | chpasswd

USER votinguser

ENV TERM xterm

# Create app directory
WORKDIR /workspace
COPY / /workspace/project
# If you are building your code for production
RUN sudo chown -R votinguser:users /workspace && \
    cd /workspace/project && npm install && \
    sudo npm install -g serve && \
    npm run build && \
    npm ci --only=production && \
    mv /workspace/project/build/* /workspace && \
    rm -Rf /workspace/project

EXPOSE 80
CMD sudo serve -s build && tail -f /dev/null