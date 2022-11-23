/* Utility function for fetching data from the backend API.
 * Uses local backend in dev and heroku in prod.
 *
 */
async function fetchFromApi(path, method, body = {}) {
  const isProd = process.env.NODE_ENV === "production";
  const url =
    (isProd
      ? "https://quickchat-api-61040.herokuapp.com/"
      : "localhost:3000/") + path;
  const options = {
    method,
    headers: { "Content-Type": "application/json" },
    body,
  };
  return await fetch(url, options);
}

export { fetchFromApi };
