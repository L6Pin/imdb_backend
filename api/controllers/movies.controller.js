const express = require("express");
const axios = require("axios");

require("dotenv").config();
const router = express.Router();

const base_url = process.env.TMDB_ENDPOINT;
const api_key = process.env.TMDB_API_KEY;

router.get("/", (req, res) => {
  axios
    .get(base_url + "/discover/movie?sort_by=popularity.desc&" + api_key)
    .then((response) => {
      const { data } = response;
      res.status(200).json({
        data,
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Server error has occurred",
      });
    });
});

router.get("/:movieId", (req, res) => {
  const movieId = req.params.movieId;
  const url = `${base_url}/movie/${movieId}?${api_key}&language=en-US`;
  axios
    .get(url)
    .then((response) => {
      const { data } = response;
      res.status(200).json({
        data,
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Server error has occurred",
      });
    });
});

router.get("/videos/:movieId", (req, res) => {
  const movieId = req.params.movieId;
  const url = `${base_url}/movie/${movieId}/videos?${api_key}&language=en-US`;
  axios
    .get(url)
    .then((response) => {
      const { data } = response;
      res.status(200).json({
        data
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Server error has occurred",
      });
    });
});

router.get("/credits/:movieId", (req, res) => {
  const movieId = req.params.movieId;
  const url = `${base_url}/movie/${movieId}/credits?${api_key}&language=en-US`;
  axios
    .get(url)
    .then((response) => {
      const { data } = response;
      res.status(200).json({
        data
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Server error has occurred",
      });
    });
});

module.exports = router;
