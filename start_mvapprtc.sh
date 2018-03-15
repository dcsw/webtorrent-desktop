#!/bin/sh
docker run -d --name mvapprtc -p 9175:9175 -v $(pwd)/src:/apprtc/src mvapprtc