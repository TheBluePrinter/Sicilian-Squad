import fetch from "node-fetch";

import {
  insertMovie,
  getAllMovies,
  getMovieById,
  softDeleteMovie,
  checkIfMovieExist,
  getAllMoviesIncludingDeleted,
  getAllRatings,
  getAllGenres,
} from "../Models/movieModel.js";

export const getMovieHandler = async (req, res) => {
  const { movieName } = req.params;

  try {
    // Hämta filmdata från OMDB API
    const response = await fetch(
      `https://www.omdbapi.com/?t=${movieName}&apikey=${process.env.APIKEY}`
    );
    const data = await response.json();

    if (data.Response === "False") {
      return res.status(404).json({ error: "Filmen hittades inte" });
    }

    // Mappa OMDB-data till dina databasfält
    const title = data.Title;
    const description = data.Plot;
    const genre = data.Genre;
    const rated = data.Rated;
    const poster = data.Poster;
    const trailer = null; // OMDB ger ej trailerdata
    const runtime = data.Runtime;
    const releaseDate = data.Released;
    const actors = Array.isArray(data.Actors)
      ? data.Actors.join(", ")
      : data.Actors || "";

    const movieExist = checkIfMovieExist(title);

    if (movieExist) {
      return res.status(400).json({ error: "Filmen finns redan" });
    }

    // Infoga filmdata i databasen
    const info = insertMovie(
      title,
      description,
      genre,
      rated,
      poster,
      trailer,
      runtime,
      releaseDate,
      actors
    );

    res.json({
      message: "Filmen har lagts till",
      title: title,
      id: info.lastInsertRowid,
    });
  } catch (error) {
    console.error("Fel vid hämtning eller insättning:", error);
    res.status(500).json({ error: "Något gick fel" });
  }
};

export const getAllMoviesHandler = (req, res) => {
  try {
    const includeDeleted = req.query.includeDeleted === "true";
    const genres = req.query.genres ? req.query.genres.split(",") : [];
    const actors = req.query.actors ? req.query.actors.split(",") : [];
    const age = req.query.age ? parseInt(req.query.age, 10) : null;

    let movies;
    if (includeDeleted) {
      movies = getAllMoviesIncludingDeleted();
    } else {
      movies = getAllMovies(genres, age, actors);
    }

    res.json(movies);
  } catch (e) {
    console.error("Fel vid hämtning av filmer:", e);
    res.status(500).json({ error: "Något gick fel" });
  }
};

export const getMovieByIdHandler = (req, res) => {
  try {
    const { movieId } = req.params;
    if (!movieId) {
      return res.status(400).json({ error: "Filmens id saknas" });
    }
    const movie = getMovieById(movieId);
    if (!movie) {
      return res.status(404).json({ error: "Filmen hittades inte" });
    }
    res.json(movie);
  } catch (error) {
    console.error("Fel vid hämtning av film:", error);
    res.status(500).json({ error: "Något gick fel" });
  }
};

export const addMovieHandler = async (req, res) => {
  const {
    title,
    description,
    genre,
    rated,
    poster,
    trailer,
    runtime,
    releaseDate,
    actors,
  } = req.body;

  if (!title || !description) {
    return res
      .status(400)
      .json({ error: "Titel och beskrivning är obligatoriska" });
  }

  try {
    const info = insertMovie(
      title,
      description,
      genre,
      rated,
      poster,
      trailer,
      runtime,
      releaseDate,
      actors
    );
    res.json({ message: "Filmen har lagts till", id: info.lastInsertRowid });
  } catch (error) {
    console.error("Fel vid insättning av film:", error);
    res.status(500).json({ error: "Något gick fel vid insättning" });
  }
};

export const deleteMovieHandler = (req, res) => {
  try {
    const { movieId } = req.params;
    if (!movieId) {
      return res.status(400).json({ error: "Filmens id saknas" });
    }
    // Använd soft delete istället för att ta bort posten direkt
    const result = softDeleteMovie(movieId);
    res.status(200).json({ message: "Film markerad som raderad", result });
  } catch (error) {
    console.error("Fel vid radering av film:", error);
    if (error.message === "Filmen hittades inte") {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: "Något gick fel vid radering av film" });
  }
};

export const getGenresHandler = (req, res) => {
  try {
    res.json(getAllGenres());
  } catch (e) {
    console.error("Fel vid hämtning av genrer:", e);
    res.status(500).json({ error: "Något gick fel" });
  }
};

export const getRatingsHandler = (req, res) => {
  try {
    res.json(getAllRatings());
  } catch (e) {
    console.error("Fel vid hämtning av ratings:", e);
    res.status(500).json({ error: "Något gick fel" });
  }
};
