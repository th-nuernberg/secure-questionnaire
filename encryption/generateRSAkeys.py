import os
#to Install PyCryptoDome:
# pip install pycryptodome
from Crypto.PublicKey import RSA

if not 'public.pem' in os.listdir() or not 'private.pem' in os.listdir():
    key = RSA.generate(2048)
    with open('public.pem', 'wb') as this:
        this.write(key.publickey().export_key('PEM', pkcs=8))

    with open('private.pem', 'wb') as this:
        this.write(key.export_key('PEM', pkcs=8))