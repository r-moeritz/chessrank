@echo off

set MongoDir="%ProgramFiles%\MongoDB 2.6 Standard"
set DataDir="C:\Users\Ingrid\Documents\mongodb\data"

%MongoDir%\bin\mongod.exe --dbpath=%DataDir%
