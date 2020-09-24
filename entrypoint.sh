#!/bin/bash
"$@"   # this is bashism for running whatever command was provided

#!/usr/bin/env bash
docker build -t galaxycowboy .           # -t for --tag
docker run -d --name galaxycowboy galaxycowboy    # -d for daemon
docker logs -f galaxycowboy              # -f for --follow
docker run --rm galaxycowboy             # --rm will remove/delete the container when it exits
docker run -p 3000:3000 galaxycowboy       # listen on port 80 on the host machine and point to 3000 in the container