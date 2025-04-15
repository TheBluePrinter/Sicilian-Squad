import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../context/UserContext';
import { getBookingsByUserId } from '../api/apiBookings';
import { Link } from 'react-router-dom';
import { getDetailedBookingsByUserId } from '../api/apiBookings';
import { BookingListItem } from '../components/BookingListItem';

export const MinaBokningar = () => {
  const { user, isLoading } = useContext(UserContext);
  const [upcomingBookings, setUpcomingBookings] = useState(null);
  const [pastBookings, setPastBookings] = useState(null);
  const [loadingBookings, setLoadingBookings] = useState(true);

  useEffect(() => {
    if (!user?.user_id) return;

    const fetchBookings = async () => {
      try {
        const data = await getDetailedBookingsByUserId(user.user_id);
        setUpcomingBookings(data.upcomingBookings || []);
        setPastBookings(data.pastBookings || []);
        setLoadingBookings(false);
      } catch (error) {
        console.error('Fel vid hämtning av bokningar:', error);
        setLoadingBookings(false);
      }
    };
    fetchBookings();
  }, [user]);

  if (isLoading) return <p>Laddar användarinfo...</p>;
  if (!user) return <p>Du måste vara inloggad för att se dina bokningar.</p>;
  if (loadingBookings) return <p>Hämtar bokningar...</p>;

  return (
    <div className='p-4'>
      <h1>Mina bokningar</h1>

      <h2>Kommande bokningar</h2>
      {upcomingBookings && upcomingBookings.length > 0 ? (
        <ul className='space-y-2'>
          {upcomingBookings.map(booking => (
            <BookingListItem key={booking.booking_number} booking={booking} />
          ))}
        </ul>
      ) : (
        <p>Inga kommande bokningar hittades.</p>
      )}

      <h2>Bokningshistorik</h2>
      {pastBookings && pastBookings.length > 0 ? (
        <ul className='space-y-2'>
          {pastBookings.map(booking => (
            <BookingListItem key={booking.booking_number} booking={booking} />
          ))}
        </ul>
      ) : (
        <p>Inga historiska bokningar hittades.</p>
      )}
    </div>
  );
};
