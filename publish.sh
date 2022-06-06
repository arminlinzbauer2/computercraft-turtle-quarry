#!/bin/bash

if [[ -f "./.env" ]]; then
  source "./.env"
fi

if [[ "$1" == "--auto" ]]; then
  if [[ "$PUBLISH_ASSETS" != "true" ]]; then
    echo "PUBLISH_ASSETS is disabled. Aborting."
    exit 0
  fi
fi

if [[ "$PUBLISH_PATH" == "" ]]; then
  echo "PUBLISH_PATH not set."
  exit 1
fi

if [[ ! -d "$PUBLISH_PATH" ]]; then
  echo "PUBLISH_PATH target doesn't exist."
  exit 2
fi

cp -r ./dist/* "${PUBLISH_PATH}/."
