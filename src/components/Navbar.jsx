import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import {
  FaBell,
  FaHome,
  FaInfoCircle,
  FaHandHoldingHeart,
  FaMicrophoneAlt,
  FaCalendarAlt,
  FaEnvelope,
  FaMusic
} from "react-icons/fa";

import { supabase } from "../supabase";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const fetchNotifications = async () => {
      const { data, error } = await supabase.from("notifications").select("*");
      if (!error && data) setNotificationCount(data.length);
    };
    fetchNotifications();
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="relative z-50">
      {/* Background Blur and Glow */}
      <div className="absolute inset-0 h-[60px] w-full bg-gradient-to-r from-purple-800 via-purple-600 to-purple-800 opacity-30 blur-xl z-[-1]" />

      {/* Navbar */}
      <header className="fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-purple-800" style={{ height: "48px" }}>
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-full">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img src="/church-logo.png" alt="Logo" className="h-6 w-auto" />
            <span className="text-white font-semibold text-xs tracking-wide hidden sm:inline">
              Victory Power Ministries
            </span>
          </Link>

          {/* Right: Notification + Menu */}
          <div className="flex items-center gap-3">
            <Link to="/notifications" className="relative">
              <FaBell className="text-white text-lg cursor-pointer" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-purple-600 text-white text-[10px] px-1 rounded-full animate-pulse">
                  {notificationCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-xl text-white md:hidden"
              aria-label="Toggle menu"
            >
              {menuOpen ? <HiX /> : <HiMenuAlt3 />}
            </button>
          </div>
        </div>

        {/* Menu Links */}
        <nav
          className={`${
            menuOpen ? "block" : "hidden"
          } md:flex md:items-center md:justify-center md:space-x-5 bg-black md:bg-transparent md:static absolute top-full left-0 w-full transition-all z-40 border-t border-purple-700 md:border-none py-1`}
        >
          <div className="flex flex-col md:flex-row md:items-center md:space-x-5 w-full md:w-auto px-4 md:px-0">
            {[
              { to: "/", label: "Home", icon: <FaHome /> },
              { to: "/about", label: "About", icon: <FaInfoCircle /> },
              { to: "/sermons", label: "Sermons", icon: <FaMicrophoneAlt /> },
              { to: "/give", label: "Give", icon: <FaHandHoldingHeart /> },
              { to: "/events", label: "Events", icon: <FaCalendarAlt /> },
              { to: "/contact", label: "Contact", icon: <FaEnvelope /> },
            ].map((item, index) => (
              <Link
                key={index}
                to={item.to}
                className="flex items-center gap-1 md:gap-2 px-3 py-2 text-xs md:text-sm text-white hover:text-purple-400 transition"
                onClick={() => setMenuOpen(false)}
              >
                {item.icon} {item.label}
              </Link>
            ))}

            {/* 🔔 Africa Praise Coming Soon Button */}
            <button
              className="mt-2 md:mt-0 animate-pulse bg-gradient-to-r from-purple-700 to-pink-600 hover:opacity-90 text-white text-xs md:text-sm px-3 py-2 rounded flex items-center gap-1 transition"
              disabled
            >
              <FaMusic /> Africa Praise Coming Soon
            </button>

            {/* Admin Login */}
            <Link
              to="/admin-login"
              className="mt-2 md:mt-0 md:ml-2 inline-block bg-purple-600 hover:bg-purple-700 text-white text-xs md:text-sm px-3 py-2 rounded transition text-center"
              onClick={() => setMenuOpen(false)}
            >
              Admin Login
            </Link>
          </div>
        </nav>
      </header>
    </div>
  );
}
