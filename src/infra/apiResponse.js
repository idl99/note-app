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
    this.body = body;

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
    const body =
      this._request.method === "GET" ? { data: this.body } : this.body;

    this._response.status(this._statusCode).json(body);
  }
}
