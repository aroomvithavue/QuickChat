import { v4 as uuidv4 } from "uuid";

const getUserId = () => {
  if (localStorage.uid) {
    return localStorage.uid;
  }
  const uid = uuidv4();
  localStorage.uid = uuidv4();
  return uid;
};

export { getUserId };
