import { useState } from "react";
import { getBookingByNumber } from "../api/apiBookings";
import { getAllScreenings } from "../api/apiScreenings";
import { getMovies } from "../api/apiMovies";
import { getSalons } from "../api/apiSalons";
import { BookingCards } from "./BookingCards";

export const BookingGuestLookUp = () => {
  const [number, setNumber] = useState("");
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const resp = await getBookingByNumber(number);
      const bookingInfo = resp.booking;
      const seats = resp.seats;

      const screenings = await getAllScreenings();
      const screening = screenings.find(
        s => String(s.screening_id) === String(bookingInfo.screening_id)
      );

      const movies = await getMovies();
      const movie = screening
        ? movies.find(m => m.movie_id === screening.movie_id)
        : null;

      const salons = await getSalons();
      const salon = screening
        ? salons.find(s => String(s.salon_id) === String(screening.salon_id))
        : null;

      setBooking({ ...bookingInfo, screening, movie, salon, seats });
      setError("");
    } catch {
      setError("Felaktigt nummer – försök igen.");
      setBooking(null);
    }
  };

  return (
    <section className="booking-lookup">
      <h2 className="section-title">Hitta din bokning</h2>

      <form className="booking-lookup__form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Ange bokningsnummer"
          value={number}
          onChange={e => setNumber(e.target.value)}
          className="booking-lookup__input"
        />
        <button type="submit" className="book-button booking-lookup__button">
          Hämta
        </button>
      </form>
      {error && <p className="error-message booking-lookup__error">{error}</p>}

      {booking && (
        <div className="booking-lookup__result">
          <BookingCards bookingData={booking} />
        </div>
      )}
    </section>
  );
};
