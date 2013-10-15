#!/bin/bash
NAME=stdout-plasmoid
zip -r ../$NAME.zip . -x ".git/*" pack.sh && mv ../$NAME.zip ../$NAME.plasmoid