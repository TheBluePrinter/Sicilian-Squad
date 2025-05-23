import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { App } from "./components/App";
import { Hem } from "./views/Hem";
import { MinaBokningar } from "./views/MinaBokningar";
import { LoggaIn } from "./views/LoggaIn";
import { MovieDetailsView } from "./views/MovieDetailsView";
import { AdderaFilm } from "./views/AdderaFilm";
import { SelectScreeningView } from "./views/SelectScreeningView";
import { SelectSeatsView } from "./views/SelectSeatsView";
import { ProtectedAdminRoutes } from "./ProtectedAdminRoutes";
import { AddScreening } from "./views/AddScreening";
import { BookingDetailsView } from "./views/BookingDetailsView";
import { ContactUs } from "./views/ContactUs";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<App />} path="/">
      <Route
        element={
          <section>
            <h1>404</h1>
          </section>
        }
        path="*"
      />
      <Route path="/" element={<Hem />} />
      <Route path="/contact" element={<ContactUs />} />
      <Route path="/min-sida" element={<MinaBokningar />} />
      <Route path="/logga-in" element={<LoggaIn />} />
      <Route path="/film/:movieId" element={<MovieDetailsView />} />
      <Route path="/boka/:movieId" element={<SelectScreeningView />} />
      <Route path="/bookings/:bookingNumber" element={<BookingDetailsView />} />
      <Route path="/contact" element={<ContactUs />} />
      <Route
        path="/boka/screening/:screeningId/:salonId"
        element={<SelectSeatsView />}
      />
      <Route element={<ProtectedAdminRoutes />}>
        <Route path="/addmovie" element={<AdderaFilm />} />
        <Route path="/screening/add" element={<AddScreening />} />
      </Route>
    </Route>
  )
);
