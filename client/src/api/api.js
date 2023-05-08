import { getUserData } from "../utilities/authentication";

export const checkAccess = async (url) => {
  const { token } = getUserData();
  const headers = { headers: { Authentication: `Bearer ${token}` } };
  const response = await fetch(url, headers);
  if (!response.ok) {
    return false;
  }
  return await response.json();
};

export const getConfirmation = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to get confirmation!");
  }
  return true;
};

export const sendUserInfo = async (data) => {
  let headers;
  if (data.isLoggedIn) {
    const { token } = getUserData();
    headers = { Authentication: `Bearer ${token}`, "Content-Type": "application/json" };
  } else {
    headers = { "Content-Type": "application/json" };
  }
  const response = await fetch(data.url, {
    method: data.method,
    headers,
    body: JSON.stringify(data.body)
  });
  if (!response.ok) {
    return false;
  }
  return true;
};

export const getCategories = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    return [];
  }
  return await response.json();
};

export const getRequestData = async (data) => {
  const headers = { headers: data.headers };
  const response = await fetch(data.url, headers);
  if (!response.ok) {
    return null;
  }
  return await response.json();
};

export const sendRequestData = async (data) => {
  const response = await fetch(data.url, {
    method: data.method,
    headers: data.headers ? data.headers : { "Content-Type": "application/json" },
    body: data.body ? JSON.stringify(data.body) : ""
  });
  if (!response.ok) {
    const data = await response.json();
    if (data.errors) {
      return data;
    } else {
      return null;
    }
  }
  return await response.json();
};
