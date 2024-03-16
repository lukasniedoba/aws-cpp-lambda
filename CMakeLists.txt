cmake_minimum_required(VERSION 3.21)
set(CMAKE_CXX_STANDARD 17)
project(aws-cpp-lambda LANGUAGES CXX)
include_directories(${CMAKE_CURRENT_SOURCE_DIR})

include(FetchContent)
FetchContent_Declare(json URL https://github.com/nlohmann/json/releases/download/v3.11.3/json.tar.xz)
FetchContent_MakeAvailable(json)

find_package(aws-lambda-runtime)
add_executable(${PROJECT_NAME} "src/main.cc")
target_link_libraries(${PROJECT_NAME} PRIVATE AWS::aws-lambda-runtime nlohmann_json::nlohmann_json)
target_compile_features(${PROJECT_NAME} PRIVATE "cxx_std_17")
target_compile_options(${PROJECT_NAME} PRIVATE "-Wall" "-Wextra")

# this line creates a target that packages your binary and zips it up
aws_lambda_package_target(${PROJECT_NAME} NO_LIBC)
