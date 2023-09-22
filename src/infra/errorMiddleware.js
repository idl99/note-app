import ApiResponse from "./apiResponse.js";

export default function (error, req, res, next) {
  const statusCode = error.statusCode ?? 500;

  return ApiResponse.with(req, res)
    .body({ message: error.message, statusCode })
    .statusCode(statusCode)
    .send();
}
