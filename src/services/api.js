import apisauce from "apisauce";
import { Alert } from "react-native";

import { basePath, csvUploadPath } from "../constants";

// import Reactotron from "reactotron-react-native";

const createFacebookApi = (baseURL = "https://graph.facebook.com/") => {
  const api = apisauce.create({
    baseURL,
    timeout: 10000
  });

  const getProfile = token =>
    api.get(
      `me?fields=id,first_name,last_name,email,picture&access_token=${token}`
    );

  return {
    getProfile
  };
};

const createGoogleApi = (baseURL = "https://www.googleapis.com/") => {
  const api = apisauce.create({
    baseURL,
    timeout: 10000
  });

  const getProfile = token => {
    api.get(
      "/oauth2/v3/userinfo",
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
  };

  return {
    getProfile
  };
};

const createCSVUploadApi = (baseURL = csvUploadPath) => {
  const api = apisauce.create({
    baseURL,
    timeout: 10000
  });

  const exportEvents = (body, accessToken) =>
    api.post("/upload", body, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${accessToken}`
      }
    });

  return {
    exportEvents
  };
};

const createApi = (baseURL = basePath) => {
  const api = apisauce.create({
    baseURL,
    timeout: 10000
  });

  const getRoot = () => api.get("/api/");

  const login = (email, password) =>
    api.post("/api/auth/login", {
      email,
      password
    });

  const loginSocial = ({ accessToken, socialId, provider, first_name, last_name }) =>
    api.post("/api/social-login", {
      access_token: accessToken,
      social_id: socialId,
      provider,
      first_name: first_name,
      last_name: last_name
    });

  const register = (email, password) =>
    api.post("/api/register", {
      email,
      password,
      password_confirmation: password
    });

  const refreshToken = accessToken =>
    api.post(
      "/api/auth/refresh",
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`
        }
      }
    );

  const headProfile = accessToken =>
    api.head("/api/me", null, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`
      }
    });

  const changePassword = (body, accessToken) =>
    api.post("/api/password/update", body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`
      }
    });

  const resetPassword = body =>
    api.post("/api/password/email", body, {
      headers: {
        "Content-Type": "application/json"
      }
    });

  const updateProfile = (updatedFields, accessToken) =>
    api.post("/api/me", updatedFields, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`
      }
    });

  const uploadProfileImage = (body, accessToken) =>
    api.post("/api/me/avatar", body, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${accessToken}`
      }
    });

  const getAnimals = accessToken =>
    api.get("/api/animals", null, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`
      }
    });

  const addAnimal = (body, accessToken) =>
    api.post("/api/animals", body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`
      }
    });

  const uploadAnimalImage = (body, accessToken, animalId) =>
    api.post(`/api/animals/${animalId}/avatar`, body, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${accessToken}`
      }
    });

  const editAnimal = (body, animalId, accessToken) =>
    api.patch(`/api/animals/${animalId}`, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`
      }
    });

  const deleteAnimal = (animalId, accessToken) =>
    api.delete(`/api/animals/${animalId}`, null, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`
      }
    });

  const getAnimalCaregiver = (body, accessToken) =>
    api.post("/api/animal/share/list", body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`
      }
    });

  const addAnimalCaregiver = (body, accessToken) =>
    api.post("/api/animal/share", body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`
      }
    });

  const deleteAnimalCaregiver = (body, accessToken) =>
    api.post("/api/animal/share/delete", body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`
      }
    });

  const saveCropImage = (body, accessToken) =>
    api.post("/api/training/upload", body, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${accessToken}`
      }
    });

  const getEvents = accessToken =>
    api.get("/api/events", null, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`
      }
    });

  const addEvent = ({ accessToken, body }) =>
    api.post("/api/events", body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`
      }
    });

  const editEvent = ({ accessToken, body }) =>
    api.patch(`/api/events/${JSON.parse(body).id}`, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`
      }
    });

  const deleteEvent = ({ accessToken, eventId }) =>
    api.delete(`/api/events/${eventId}`, null, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`
      }
    });

  const completeEvent = ({ accessToken, eventId, completed }) => {
    return api.patch(
      `/api/events/${eventId}`,
      { id: eventId, completed: completed },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`
        }
      }
    );
  };

  const completeEventWithDataUpdate = ({
    accessToken,
    eventId,
    completed,
    data
  }) => {
    return api.patch(
      `/api/events/${eventId}`,
      { id: eventId, completed: completed, data },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`
        }
      }
    );
  };

  const completeRecurringEvent = ({
    accessToken,
    eventId,
    startDate,
    endDate
  }) =>
    api.post(
      "/api/events/duplicate",
      { event_id: eventId, start_date: startDate, end_date: endDate },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`
        }
      }
    );

  const completeRecurringEventWithData = ({
    accessToken,
    eventId,
    startDate,
    endDate,
    completed,
    type,
    data
  }) => {
    return api.post(
      "/api/events",
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`
        }
      }
    );
  };

  const deleteAccount = ({ accessToken }) =>
    api.post("api/me/delete", null, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`
      }
    });

  return {
    getRoot,
    login,
    loginSocial,
    resetPassword,
    refreshToken,
    headProfile,
    updateProfile,
    changePassword,
    uploadProfileImage,
    register,
    getAnimals,
    addAnimal,
    uploadAnimalImage,
    editAnimal,
    deleteAnimal,
    getAnimalCaregiver,
    addAnimalCaregiver,
    deleteAnimalCaregiver,
    saveCropImage,
    getEvents,
    addEvent,
    editEvent,
    deleteEvent,
    completeEvent,
    completeEventWithDataUpdate,
    deleteAccount,
    completeRecurringEvent,
    completeRecurringEventWithData
  };
};

export { createApi, createFacebookApi, createGoogleApi, createCSVUploadApi };
