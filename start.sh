#!/bin/bash

echo "Building Frontend"
echo "================"
cd RTSER &&
npm run build

echo 
echo "Starting Flask Server"
echo "====================="
cd .. &&
flask run -h localhost -p 8000

