import React, { useEffect, useState } from "react";
import {
  FaThumbsUp,
  FaShareAlt,
  FaHandHoldingHeart,
  FaCalendarAlt,
} from "react-icons/fa";
import { supabase } from "../supabase";
import { Link } from "react-router-dom";

export default function Home() {
  const [sermons, setSermons] = useState([]);
  const [loadingSermons, setLoadingSermons] = useState(true);
  const [likedSermons, setLikedSermons] = useState(new Set());

  // Fetch sermons from Supabase
  useEffect(() => {
    const fetchSermons = async () => {
      setLoadingSermons(true);
      const { data, error } = await supabase
        .from("sermons")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching sermons:", error.message);
      } else {
        setSermons(data);
      }
      setLoadingSermons(false);
    };

    fetchSermons();
  }, []);

  // Toggle like
  const toggleLike = async (sermon) => {
    const user = supabase.auth.getUser();
    const userId = (await user).data?.user?.id;

    if (!userId) {
      alert("You must be logged in to like a sermon.");
      return;
    }

    const hasLiked = likedSermons.has(sermon.id);

    if (hasLiked) {
      // Remove like
      const { error } = await supabase
        .from("sermon_likes")
        .delete()
        .match({ sermon_id: sermon.id, user_id: userId });

      if (!error) {
        setLikedSermons((prev) => {
          const updated = new Set(prev);
          updated.delete(sermon.id);
          return updated;
        });
        setSermons((prev) =>
          prev.map((s) =>
            s.id === sermon.id ? { ...s, likes: (s.likes || 1) - 1 } : s
          )
        );
      }
    } else {
      // Add like
      const { error } = await supabase.from("sermon_likes").insert([
        {
          sermon_id: sermon.id,
          user_id: userId,
        },
      ]);

      if (!error) {
        setLikedSermons((prev) => new Set(prev).add(sermon.id));
        setSermons((prev) =>
          prev.map((s) =>
            s.id === sermon.id ? { ...s, likes: (s.likes || 0) + 1 } : s
          )
        );
      }
    }
  };

  // Share sermon logic
  const shareSermon = (sermon) => {
    const shareText = `${sermon.title}\nWatch now: ${sermon.publicVideoUrl}`;
    navigator.clipboard.writeText(shareText);
    alert("Sermon link copied to clipboard!");
  };

  return (
    <div className="bg-gray-950 text-white min-h-screen px-6 py-10">
      {/* Header */}
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-purple-500">
          Victory Power International Ministries
        </h1>
        <p className="text-lg mt-2 text-gray-300">
          Welcome to our global church family. We preach Christ and Him
          crucified.
        </p>
      </header>

      {/* Quick Access */}
      <nav className="max-w-6xl mx-auto mb-12 flex justify-center gap-8 text-yellow-400">
        <Link
          to="/give"
          className="flex items-center gap-2 hover:text-yellow-300 transition-colors duration-300 font-semibold text-lg"
        >
          <FaHandHoldingHeart size={22} />
          Giving / Offering
        </Link>

        <Link
          to="/events"
          className="flex items-center gap-2 hover:text-yellow-300 transition-colors duration-300 font-semibold text-lg"
        >
          <FaCalendarAlt size={22} />
          Events
        </Link>
      </nav>

      {/* Sermons Section */}
      <section className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-semibold text-purple-500 mb-6">
          Recent Sermons
        </h2>

        {loadingSermons ? (
          <p className="text-gray-400">Loading sermons...</p>
        ) : sermons.length === 0 ? (
          <p className="text-gray-400">
            📭 No sermons have been uploaded yet. Stay tuned!
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {sermons.map((sermon) => (
              <div
                key={sermon.id}
                className="bg-purple-900 rounded-lg p-5 shadow-lg flex flex-col"
              >
                <h3
                  className="text-2xl font-semibold text-white mb-3 truncate"
                  title={sermon.title}
                >
                  {sermon.title}
                </h3>

                {sermon.publicVideoUrl && (
                  <video
                    controls
                    className="w-full rounded mb-4 shadow-lg aspect-video"
                    preload="metadata"
                    src={sermon.publicVideoUrl}
                  >
                    Your browser does not support the video tag.
                  </video>
                )}

                <div className="flex justify-start gap-6 text-purple-300 text-lg mt-auto">
                  <button
                    onClick={() => toggleLike(sermon)}
                    className={`hover:text-yellow-400 flex items-center gap-1 text-sm font-medium rounded px-3 py-1
                    transition-colors duration-200 ${
                      likedSermons.has(sermon.id)
                        ? "text-yellow-400"
                        : "text-purple-300"
                    }`}
                    title={
                      likedSermons.has(sermon.id) ? "Unlike" : "Like Sermon"
                    }
                  >
                    <FaThumbsUp />
                    {sermon.likes ?? 0}
                  </button>

                  <button
                    onClick={() => shareSermon(sermon)}
                    className="hover:text-pink-400 flex items-center gap-1 text-sm font-medium rounded px-3 py-1 transition-colors duration-200"
                    title="Share sermon"
                  >
                    <FaShareAlt />
                    Share
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
