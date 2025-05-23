import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import "../styling/App.css";
import { Footer } from "./Footer";

export function App() {
  return (
    <div className="wrapper">
      <Navbar />
      <main className="content fade-container">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};