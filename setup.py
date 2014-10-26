from setuptools import setup, find_packages
from codecs import open
from os import path

here = path.abspath(path.dirname(__file__))

with open(path.join(here, 'DESCRIPTION.rst'), encoding='utf-8') as f:
    long_description = f.read()

setup(
    name             = 'chessrank',
    version          = '0.1.0',
    description      = 'A web based chess tournament organizer',
    long_description = long_description,
    url              = 'https://github.com/rmoritz/chessrank',
    author           = 'Ralph Moritz',
    author_email     = 'ralphmoritz@outlook.com',
    license          = 'MIT',
    keywords         = ['swiss', 'pairing', 'dutch', 'chess', 'tournament', 'organizer'],
    packages         = ['chessrank'],
    install_requires = [
        'tornado == 4.0.2',
        'motor == 0.3.2',
        'py-bcrypt == 0.4',
        'elo == 0.1',
        'python-dateutil == 2.2',
        'itsdangerous == 0.24',
        'swissdutch == 0.1.0',
        'tornado-smtp == 0.1.0',
        'jsonschema == 2.4.0'
    ],
    classifiers      = [
        'Development Status :: 3 - Alpha',
        'License :: OSI Approved :: MIT License',
        'Operating System :: OS Independent',
        'Programming Language :: Python :: 3',
        'Programming Language :: Python :: 3.4'
    ],
)
