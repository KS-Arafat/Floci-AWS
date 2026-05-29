#!/bin/bash
echo "Hello From Client" > /tmp/hello.txt
yum install -y nginx
nginx -g "daemon off;" &