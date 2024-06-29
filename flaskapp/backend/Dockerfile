# use python container image
From python:3.8

# set the working directory of the image filesystem 
WORKDIR /backend

# copy current directory to the working directory 
ADD . /backend

# Install the python dependencies
RUN pip install -r requirements.txt

EXPOSE 5000
CMD ["gunicorn", "-w", "1", "-b", "0.0.0.0:5000", "app:app"]
