var baseURL = "https://api.getuserlog.com/api";
var apiVersion = "/v1";

var endpoints = {
  LOG: baseURL + apiVersion + "/log",
  PAGE: baseURL + apiVersion + "/page",
};

class HTTPResponseError extends Error {
  message;
  constructor(status, statusText, errorBody) {
    super(`HTTP Error Response: ${status} ${statusText}`);
    this.message = this.createReadableString(errorBody);
  }

  createReadableString(errorBody) {
    let errorMessage = "[UserLog] Failed to publish: ";
    if (errorBody && errorBody.validation && Array.isArray(errorBody.validation.body)) {
      errorMessage += errorBody.validation.body.map((item) => item.message).join(", ");
    } else {
      errorMessage += ": Please check our docs at https://docs.getuserlog.com";
    }
    return errorMessage;
  }

  toString() {
    return this.message;
  }

  toJSON() {
    return { message: this.message };
  }
}

function isTimestampInSeconds(timestamp) {
  return Math.abs(Date.now() - timestamp) < Math.abs(Date.now() - timestamp * 1e3);
}

function normalizeTimestamp(input) {
  if (input) {
    if (input instanceof Date) {
      input = input.getTime();
    }
    if (isTimestampInSeconds(input)) {
      input = Math.floor(input / 1e3);
    }
    return input;
  }
}

class UserLog {
  api_key;
  project;
  disabled = false;

  constructor({ api_key, project, disableTracking = false }) {
    this.api_key = api_key;
    this.project = project;
    this.disabled = disableTracking || false;
  }

  disableTracking() {
    this.disabled = true;
  }

  enableTracking() {
    this.disabled = false;
  }

  isTrackingDisabled() {
    return this.disabled;
  }

  getProject() {
    return this.project;
  }

  createAuthorizationHeader() {
    return `Bearer ${this.api_key}`;
  }

  createHeaders() {
    return {
      "Content-Type": "application/json",
      Authorization: this.createAuthorizationHeader(),
    };
  }

  async track(eventData) {
    if (this.isTrackingDisabled()) return true;

    let headers = this.createHeaders();
    let method = "POST";
    eventData.timestamp = normalizeTimestamp(eventData.timestamp);
    let body = JSON.stringify({
      ...eventData,
      project: this.getProject(),
    });

    let response = await fetch(endpoints.LOG, {
      method: method,
      body: body,
      headers: headers,
    });

    if (!response.ok) {
      throw new HTTPResponseError(response.status, response.statusText, await response.json());
    }
    return true;
  }
}

export { HTTPResponseError, UserLog };
