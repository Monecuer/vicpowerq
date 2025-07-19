import React, { useEffect, useState } from "react";
import { supabase } from "../supabase";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching events:", error.message);
      } else {
        setEvents(data);
      }
      setLoading(false);
    };

    fetchEvents();
  }, []);

  return (
    <div className="bg-gray-950 text-white min-h-screen px-6 py-10">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-yellow-400">Upcoming Events</h1>
        <p className="text-gray-300 mt-2 max-w-xl mx-auto">
          Stay updated with all our church events and gatherings.
        </p>
      </header>

      {loading ? (
        <p className="text-gray-400 text-center">Loading events...</p>
      ) : events.length === 0 ? (
        <p className="text-gray-400 text-center">No events available at the moment.</p>
      ) : (
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {events.map(({ id, title, image_url }) => (
            <div
              key={id}
              className="bg-purple-900 rounded-lg shadow-lg p-5 flex flex-col"
            >
              <h2 className="text-2xl font-semibold mb-3">{title}</h2>

              {image_url && (
                <img
                  src={image_url}
                  alt={title}
                  className="rounded mb-4 object-cover w-full h-48"
                />
              )}

              {/* Description removed completely */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
