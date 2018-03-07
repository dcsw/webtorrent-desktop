#!/bin/sh
docker run -d --name me -p 9175:9175 -p 8080:8080 -p 81:80 -v `pwd`/src:/apprtc/src mvapprtc