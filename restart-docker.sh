#!/bin/bash

osascript -e 'quit app "Docker"'
sleep 5
open -a Docker
while ! docker info >/dev/null 2>&1; do
  echo "Waiting for Docker daemon..."
  sleep 2
done
echo "Docker is running!"
