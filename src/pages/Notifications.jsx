import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { FaBell } from "react-icons/fa";
// ✅ Example usage
import { supabase } from '../supabase'; // always import, never re-create


export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching notifications:", error.message);
    } else {
      setNotifications(data);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white px-4 py-20">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-purple-400 flex items-center gap-2 mb-6">
          <FaBell /> Notifications
        </h1>

        {loading ? (
          <p className="text-center text-gray-400">Loading...</p>
        ) : notifications.length === 0 ? (
          <p className="text-center text-gray-400">No notifications yet.</p>
        ) : (
          <ul className="space-y-4">
            {notifications.map((note) => (
              <li
                key={note.id}
                className="bg-gray-900 rounded-lg p-4 border border-purple-800 shadow-md hover:scale-[1.01] transition"
              >
                <h2 className="text-lg font-semibold">{note.title}</h2>
                <p className="text-sm text-gray-300">{note.message}</p>
                <p className="text-xs text-gray-500 mt-2">
                  {new Date(note.created_at).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
