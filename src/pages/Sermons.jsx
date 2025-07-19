import React, { useEffect, useState } from "react";
import { FaThumbsUp, FaShareAlt } from "react-icons/fa";
import { supabase } from "../supabase";

export default function Sermons() {
  const [sermons, setSermons] = useState([]);
  const [likedSermons, setLikedSermons] = useState(new Set());
  const [loading, setLoading] = useState(true);

  // Load liked sermons from localStorage on mount
  useEffect(() => {
    const liked = localStorage.getItem("likedSermons");
    if (liked) setLikedSermons(new Set(JSON.parse(liked)));
  }, []);

  // Fetch sermons data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: sermonsData, error } = await supabase
        .from("sermons")
        .select("id, title, video_url,likes")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching sermons:", error.message);
        setLoading(false);
        return;
      }

      // Get public URLs for videos (if using Supabase Storage)
      const sermonsWithUrls = sermonsData.map((sermon) => {
        const { data: urlData } = supabase.storage
          .from("sermons")
          .getPublicUrl(sermon.video_url);

        return {
          ...sermon,
          publicVideoUrl: urlData?.publicUrl || sermon.video_url, // fallback direct URL
        };
      });

      setSermons(sermonsWithUrls);
      setLoading(false);
    };

    fetchData();
  }, []);

  // Toggle like status locally and update DB count
  const toggleLike = async (sermon) => {
    const isLiked = likedSermons.has(sermon.id);

    // Optimistic UI update
    setSermons((prev) =>
      prev.map((s) =>
        s.id === sermon.id
          ? { ...s, likes: isLiked ? Math.max(s.likes - 1, 0) : (s.likes || 0) + 1 }
          : s
      )
    );

    let newLikesSet = new Set(likedSermons);
    if (isLiked) {
      newLikesSet.delete(sermon.id);
    } else {
      newLikesSet.add(sermon.id);
    }
    setLikedSermons(newLikesSet);
    localStorage.setItem("likedSermons", JSON.stringify(Array.from(newLikesSet)));

    // Update likes count in Supabase DB
    const { error } = await supabase
      .from("sermons")
      .update({
        likes: isLiked ? sermon.likes - 1 : sermon.likes + 1,
      })
      .eq("id", sermon.id);

    if (error) console.error("Error updating likes:", error.message);
  };

  // Share sermon video URL with Web Share API or clipboard fallback
  const shareSermon = async (sermon) => {
    const url = sermon.publicVideoUrl;
    if (navigator.share) {
      try {
        await navigator.share({
          title: sermon.title,
          text: sermon.title,
          url: url,
        });
      } catch (err) {
        alert("Error sharing: " + err.message);
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        alert("Video URL copied to clipboard!");
      } catch {
        alert("Sharing not supported and clipboard write failed.");
      }
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-950 text-white">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  return (
    <main className="min-h-screen bg-gray-950 text-white px-6 py-10">
      <header className="text-center mb-10">
        <h1 className="text-5xl font-extrabold text-purple-500 tracking-wide">
          Sermons & Messages
        </h1>
        <p className="mt-3 max-w-xl mx-auto text-gray-400 font-light">
          Watch and be blessed by the word of God shared in our recent services.
        </p>
      </header>

      {sermons.length === 0 ? (
        <div className="text-center text-gray-400 mt-24 text-2xl select-none">
          📭 No sermons available yet. Please check back later.
        </div>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {sermons.map((sermon) => (
            <article
              key={sermon.id}
              className="bg-purple-900 rounded-xl shadow-lg p-6 flex flex-col hover:shadow-purple-700 transition-shadow duration-300"
            >
              <h2
                className="text-2xl font-semibold mb-3 text-white truncate"
                title={sermon.title}
              >
                {sermon.title}
              </h2>

              {sermon.publicVideoUrl && (
                <video
                  controls
                  className="rounded-md mb-4 shadow-lg aspect-video"
                  preload="metadata"
                >
                  <source src={sermon.publicVideoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}

              <div className="mt-auto flex justify-between items-center text-purple-300">
                <button
                  onClick={() => toggleLike(sermon)}
                  aria-label={
                    likedSermons.has(sermon.id) ? "Unlike sermon" : "Like sermon"
                  }
                  className={`flex items-center gap-2 text-sm font-medium rounded px-3 py-1
                    hover:text-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400
                    transition-colors duration-200 ${
                      likedSermons.has(sermon.id)
                        ? "text-yellow-400"
                        : "text-purple-300"
                    }`}
                  title={likedSermons.has(sermon.id) ? "Unlike" : "Like"}
                >
                  <FaThumbsUp size={18} />
                  {sermon.likes ?? 0}
                </button>

                <button
                  onClick={() => shareSermon(sermon)}
                  className="flex items-center gap-2 text-sm font-medium rounded px-3 py-1
                    hover:text-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-400
                    transition-colors duration-200"
                  title="Share sermon"
                >
                  <FaShareAlt size={18} />
                  Share
                </button>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
