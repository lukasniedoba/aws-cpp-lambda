#!/usr/bin/env bash
cd build
cmake .. -DCMAKE_BUILD_TYPE=Release
make -j$(nproc)
make aws-lambda-package-aws-cpp-lambda