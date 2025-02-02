FROM ubuntu:latest
LABEL authors="ann"

ENTRYPOINT ["top", "-b"]