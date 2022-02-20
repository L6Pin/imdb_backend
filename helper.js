module.exports = (isDev) =>
  isDev === "true"
    ?  "http://localhost:8080"
    :  "https://en-joyers-backend.herokuapp.com";
