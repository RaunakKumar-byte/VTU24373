import axios from "axios";
import { NOTIFICATIONS_API_URL } from "../config/constants.js";
import { resolveAuthorizationHeader } from "./authApi.js";

/**
 * Fetch notifications from the evaluation service API.
 *
 * Auth: set registration credentials in .env (recommended), or paste
 * a Bearer token into AUTHORIZATION_TOKEN.
 *
 * @returns {Promise<object[]>}
 */
export async function fetchNotificationsFromApi() {
  const authorization = await resolveAuthorizationHeader();

  try {
    const response = await axios.get(NOTIFICATIONS_API_URL, {
      headers: {
        Accept: "application/json",
        Authorization: authorization,
      },
      timeout: 15_000,
    });

    const notifications = response.data?.notifications;

    if (!Array.isArray(notifications)) {
      throw new Error(
        "Unexpected API response: 'notifications' array not found"
      );
    }

    return notifications;
  } catch (error) {
    throw mapApiError(error);
  }
}

/**
 * Translate axios / network failures into actionable errors.
 *
 * @param {unknown} error
 * @returns {Error}
 */
function mapApiError(error) {
  if (!axios.isAxiosError(error)) {
    return error instanceof Error
      ? error
      : new Error("Unknown error while fetching notifications");
  }

  if (error.code === "ECONNABORTED") {
    return new Error("Notification API request timed out after 15 seconds");
  }

  if (error.response) {
    const status = error.response.status;
    const message =
      error.response.data?.message ??
      error.response.statusText ??
      "Unknown API error";

    if (status === 401) {
      return new Error(
        `Notification API authorization failed (401): ${message}. Check AUTHORIZATION_TOKEN in .env`
      );
    }

    if (status >= 500) {
      return new Error(
        `Notification API server error (${status}): ${message}. Retry later.`
      );
    }

    return new Error(`Notification API error (${status}): ${message}`);
  }

  if (error.request) {
    return new Error(
      "Unable to reach the notification API. Check network connectivity."
    );
  }

  return new Error(error.message);
}
