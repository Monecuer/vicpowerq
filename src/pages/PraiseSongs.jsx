import React, { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { FaUpload, FaDownload, FaMusic, FaPrayingHands } from "react-icons/fa";

export default function PraiseSongs({ isAdmin }) {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newFile, setNewFile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSongs = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("praise_songs")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) {
        console.error(error);
      } else {
        setSongs(data);
      }
      setLoading(false);
    };
    fetchSongs();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    setError("");

    if (!newTitle.trim()) {
      setError("Please enter a song title.");
      return;
    }
    if (!newFile) {
      setError("Please select an audio file.");
      return;
    }

    setUploading(true);

    const fileExt = newFile.name.split(".").pop();
    const fileName = `${Date.now()}_${newTitle.trim().replace(/\s+/g, "_")}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("praise_songs")
      .upload(filePath, newFile, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      setError("Upload failed: " + uploadError.message);
      setUploading(false);
      return;
    }

    const { error: dbError } = await supabase.from("praise_songs").insert([
      { title: newTitle.trim(), file_path: filePath },
    ]);

    if (dbError) {
      setError("Database update failed: " + dbError.message);
      setUploading(false);
      return;
    }

    const { data } = await supabase
      .from("praise_songs")
      .select("*")
      .order("created_at", { ascending: false });

    setSongs(data);
    setNewTitle("");
    setNewFile(null);
    setUploading(false);
  };

  const getDownloadUrl = (path) => {
    const { data } = supabase.storage.from("praise_songs").getPublicUrl(path);
    return data.publicUrl;
  };

  // Loading spinner with praying hands icon
  const LoadingSpinner = () => (
    <div className="flex justify-center items-center space-x-4 py-8">
      <div className="relative w-12 h-12">
        {/* Spinning circle */}
        <svg
          className="animate-spin -ml-1 text-yellow-400"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={3}
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8z"
          />
        </svg>

        {/* Centered praying hands icon */}
        <FaPrayingHands
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-yellow-400"
          size={24}
        />
      </div>

      <span className="text-yellow-400 font-semibold text-lg">Loading...</span>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-900 text-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-3 text-yellow-400">
        <FaMusic /> Africa Praise Songs
      </h1>

      {/* Upload Form — Only show if admin */}
      {isAdmin && (
        <form
          onSubmit={handleUpload}
          className="mb-8 flex flex-col space-y-4 bg-gray-800 p-4 rounded"
          aria-label="Upload new praise song"
        >
          <label className="flex flex-col">
            <span className="mb-1 font-semibold">Song Title</span>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="rounded px-3 py-2 text-black"
              placeholder="Enter song title"
              disabled={uploading}
              required
            />
          </label>

          <label className="flex flex-col">
            <span className="mb-1 font-semibold">Audio File</span>
            <input
              type="file"
              accept="audio/*"
              onChange={(e) => setNewFile(e.target.files[0])}
              disabled={uploading}
              required
            />
          </label>

          {error && <p className="text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={uploading}
            className="flex items-center justify-center gap-2 bg-yellow-400 text-black font-bold py-2 rounded hover:bg-yellow-300 transition"
          >
            {uploading ? "Uploading..." : (
              <>
                <FaUpload /> Upload Song
              </>
            )}
          </button>
        </form>
      )}

      {/* Songs List */}
      <h2 className="text-2xl font-semibold mb-4">Available Songs</h2>

      {loading ? (
        <LoadingSpinner />
      ) : songs.length === 0 ? (
        <p className="text-gray-400">No songs uploaded yet.</p>
      ) : (
        <ul className="space-y-4" aria-live="polite">
          {songs.map(({ id, title, file_path }) => (
            <li
              key={id}
              className="bg-purple-800 p-4 rounded flex items-center justify-between"
            >
              <span>{title}</span>
              <a
                href={getDownloadUrl(file_path)}
                download
                className="flex items-center gap-2 bg-yellow-400 text-black px-3 py-1 rounded hover:bg-yellow-300 transition"
                title={`Download ${title}`}
              >
                <FaDownload /> Download
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
