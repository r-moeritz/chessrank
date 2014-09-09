@echo off

set MongoDir="%ProgramFiles%\MongoDB 2.6 Standard"
set DataDir="E:\Ralph\Data\mongodb\data"

%MongoDir%\bin\mongod.exe --dbpath=%DataDir%
