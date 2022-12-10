import { v4 as uuidv4 } from "uuid";

const getUserId = () => {
  if (localStorage.uid) {
    return localStorage.uid;
  }
  const uid = uuidv4();
  localStorage.uid = uuidv4();
  return uid;
};

const getUsername = () => {
  if (localStorage.username) {
    return localStorage.username;
  }
  const randomId = Math.floor(Math.random() * 99999);
  localStorage.username = `Anonymous_${randomId}`;
  return `Anonymous_${randomId}`;
};

const setUsername = (newUsername) => {
  localStorage.username = newUsername;
};

export { getUserId, getUsername, setUsername };
