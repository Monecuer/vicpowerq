import React, { useEffect, useState } from "react";
import {
  FaClock,
  FaBookOpen,
  FaDownload,
  FaHeart,
  FaShareAlt,
} from "react-icons/fa";
import { supabase } from "../supabase";
import ReactPlayer from "react-player";

export default function Sermons() {
  const [sermons, setSermons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSermons();
  }, []);

  async function fetchSermons() {
    setLoading(true);
    const { data, error } = await supabase
      .from("sermons")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching sermons:", error.message);
    } else {
      setSermons(data);
    }
    setLoading(false);
  }

  async function handleLike(id, currentLikes) {
    const newLikes = currentLikes + 1;
    setSermons((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, likes: newLikes } : s
      )
    );
    const { error } = await supabase
      .from("sermons")
      .update({ likes: newLikes })
      .eq("id", id);

    if (error) console.error("Error updating likes:", error.message);
  }

  async function handleShare(url, title) {
    if (navigator.share) {
      try {
        await navigator.share({ title, text: title, url });
      } catch (err) {
        console.error("Share failed:", err);
      }
    } else {
      navigator.clipboard.writeText(url);
      alert("Link copied to clipboard.");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950 text-white">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white px-4 py-10">
      <h1 className="text-4xl font-bold text-yellow-400 mb-8 text-center">
        🔊 Sermons & Messages
      </h1>
      {sermons.length === 0 && (
        <p className="text-center text-gray-500">No sermons available.</p>
      )}
      <div className="grid gap-10 max-w-6xl mx-auto grid-cols-1 md:grid-cols-2">
        {sermons.map((sermon, i) => (
          <div
            key={sermon.id}
            className="bg-gray-900 border border-gray-800 rounded-xl shadow-sm p-4"
          >
            <div className="aspect-video rounded overflow-hidden">
              <ReactPlayer
                url={sermon.publicVideoUrl}
                width="100%"
                height="100%"
                controls
                playing={i === 0}
                muted={i === 0}
              />
            </div>

            <h2 className="text-xl font-semibold mt-4 flex items-center gap-2">
              <FaBookOpen className="text-yellow-500" />
              {sermon.title}
            </h2>
            <div className="mt-1 flex items-center gap-2 text-gray-400 text-sm">
              <FaClock />
              {new Date(sermon.created_at).toLocaleString()}
            </div>

            <div className="flex justify-between items-center mt-4 text-sm">
              <button
                onClick={() => handleLike(sermon.id, sermon.likes)}
                className="flex items-center gap-1 text-pink-400 hover:text-pink-500 transition"
              >
                <FaHeart /> {sermon.likes || 0}
              </button>

              <button
                onClick={() =>
                  handleShare(sermon.publicVideoUrl, sermon.title)
                }
                className="flex items-center gap-1 text-blue-400 hover:text-blue-500 transition"
              >
                <FaShareAlt /> Share
              </button>

              <a
                href={sermon.publicVideoUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-3 py-1 rounded shadow"
              >
                <FaDownload /> Download
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
