FROM node:22

ARG REFRESHED_AT
ENV REFRESHED_AT $REFRESHED_AT

SHELL ["/bin/bash", "-o", "pipefail", "-c"]

RUN apt-get update -qq \
&& apt-get install -qq --no-install-recommends \
chromium \
&& apt-get clean \
&& rm -rf /var/lib/apt/lists/* \
&& ln -s /usr/bin/chromium /usr/bin/google-chrome

ADD ./whatsapp /src

WORKDIR /src

# RUN npm install

RUN npx tsc --build

EXPOSE 4000