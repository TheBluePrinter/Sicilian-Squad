import { useState, useEffect, useContext } from "react";
import { getMovies, deleteMovie } from "../api/apiMovies";
import { MovieCard } from "../components/MovieCards";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

export const Hem = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  useEffect(() => {
    getMovies()
      .then((data) => {
        setMovies(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Något gick fel");
        setLoading(false);
      });
  }, []);

  const handleDelete = async (movieId) => {
    if (!user?.user_admin) {
      setError("Du måste vara admin för att kunna radera filmer");
      return;
    }
    try {
      await deleteMovie(movieId);
      getMovies().then((data) => setMovies(data));
    } catch (err) {
      setError(err.message || "Något gick fel");
    }
  };

  const handleAddMovie = () => {
    navigate("/addmovie");
  };

  if (loading) return <div>Laddar filmer...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Alla Filmer</h1>
      {user && user.user_admin === 1 && (
        <button onClick={handleAddMovie} className="admin-add-button">
          Lägg till film
        </button>
      )}
      <div className="movie-cards-container">
        {movies.map((movie) => (
          <div key={movie.movie_id} className="movie-card-wrapper">
            <MovieCard movie={movie} />
            {user && user.user_admin === 1 && (
              <button
                className="delete-button"
                onClick={() => handleDelete(movie.movie_id)}
              >
                ❌
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
