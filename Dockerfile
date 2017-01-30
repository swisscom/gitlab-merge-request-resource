FROM concourse/buildroot:git

COPY scripts/ /opt/resource/
RUN chmod +x /opt/resource/*
