export default class ApiResponse {
  /**
   *
   * @param {import("express").Request} request
   * @param {import("express").Response} response
   */
  constructor(request, response) {
    this._request = request;
    this._response = response;
    this._statusCode = 200;
  }

  /**
   *
   * @param {import("express").Request} request
   * @param {import("express").Response} response
   * @returns
   */
  static with(request, response) {
    return new ApiResponse(request, response);
  }

  /**
   * Sets the body of the function.
   *
   * @param {any} body - The body of the function.
   * @return {ApiResponse} - The updated builder object.
   */
  body(body) {
    this._body = body;

    return this;
  }

  /**
   * Sets the status code for the response.
   *
   * @param {number} statusCode - The status code to set.
   * @return {ApiResponse} - The updated builder object.
   */
  statusCode(statusCode) {
    this._statusCode = statusCode;

    return this;
  }

  send() {
    let responsePayload = this._body;

    if (this._body.isError) {
      const { isError, ...error } = this._body;
      responsePayload = { error };
    } else {
      if (this._request.method === "GET") {
        responsePayload = { data: this._body };

        if (Array.isArray(this._body)) {
          responsePayload.count = this._body.length;
        }
      }
    }

    this._response.status(this._statusCode).json(responsePayload);
  }
}
