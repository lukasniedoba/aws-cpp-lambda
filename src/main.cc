#include <aws/lambda-runtime/runtime.h>
#include <iostream>

#include <nlohmann/json.hpp>

using namespace aws::lambda_runtime;

static invocation_response my_handler(invocation_request const &req) {
  std::cout << "Some output, could be found in AWS CloudWatch";
  nlohmann::json request = nlohmann::json::parse(req.payload);
  std::cout << "Got request: " << request.dump();
  request["newField"] = "addedFieldByLambda";
  std::cout << "Going to return: " << request.dump();
  return invocation_response::success(request.dump(), "application/json");
}

int main() {
  run_handler(my_handler);
  return 0;
}
