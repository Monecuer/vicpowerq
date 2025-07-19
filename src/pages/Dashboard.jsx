import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from '../supabase';

import { FaUpload, FaBell, FaDollarSign, FaVideo, FaImage } from "react-icons/fa";

function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center">
      <div className="w-10 h-10 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({
    sermon: false,        // fixed keys to match usage
    event: false,
    notification: false,
    giving: false,
  });

  const [form, setForm] = useState({
    sermonTitle: "",
    sermonVideo: null,
    eventTitle: "",
    eventImage: null,
    notificationText: "",
    ecoCashNumber: "",
    visaInstructions: "",
    inbucksDetails: ""
  });

  const [user, setUser] = useState(null);
  const [sermons, setSermons] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const getUserAndData = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user || data.user.email !== "anesuelsha4@gmail.com") {
        navigate("/admin-login");
        return;
      }
      setUser(data.user);

      let { data: sermonsData, error: sermonsError } = await supabase
        .from("sermons")
        .select()
        .order("created_at", { ascending: false });
      if (!sermonsError) setSermons(sermonsData);

      let { data: eventsData, error: eventsError } = await supabase
        .from("events")
        .select()
        .order("created_at", { ascending: false });
      if (!eventsError) setEvents(eventsData);

      setLoading(false);
    };
    getUserAndData();
  }, [navigate]);

  const handleFileChange = (e, field) => {
    setForm({ ...form, [field]: e.target.files[0] });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Upload Sermon
  const uploadSermon = async () => {
    if (!form.sermonTitle || !form.sermonVideo) return alert("Fill all sermon fields");
    try {
      setActionLoading(prev => ({ ...prev, sermon: true }));

      // Bucket name: 'sermons' (matches Sermons page bucket)
      const fileName = `${Date.now()}_${form.sermonVideo.name}`;
      const { data, error } = await supabase.storage.from("sermons").upload(fileName, form.sermonVideo);
      if (error) throw error;

      const { data: insertData, error: insertError } = await supabase.from("sermons").insert([
        { title: form.sermonTitle, video_url: data.path }
      ]);
      if (insertError) throw insertError;

      alert("Sermon uploaded!");

      // Refresh sermons list
      const { data: sermonsData } = await supabase.from("sermons").select().order("created_at", { ascending: false });
      setSermons(sermonsData);

      // Clear sermon inputs
      setForm(prev => ({ ...prev, sermonTitle: "", sermonVideo: null }));
    } catch (error) {
      alert(error.message);
    } finally {
      setActionLoading(prev => ({ ...prev, sermon: false }));
    }
  };

  // Upload Event
  const uploadEvent = async () => {
    if (!form.eventTitle || !form.eventImage) return alert("Fill all event fields");
    try {
      setActionLoading(prev => ({ ...prev, event: true }));

      // Bucket name: 'events'
      const fileName = `${Date.now()}_${form.eventImage.name}`;
      const { data, error } = await supabase.storage.from("events").upload(fileName, form.eventImage);
      if (error) throw error;

      const { error: insertError } = await supabase.from("events").insert([
        { title: form.eventTitle, image_url: data.path }
      ]);
      if (insertError) throw insertError;

      alert("Event uploaded!");

      // Refresh events list
      const { data: eventsData } = await supabase.from("events").select().order("created_at", { ascending: false });
      setEvents(eventsData);

      // Clear event inputs
      setForm(prev => ({ ...prev, eventTitle: "", eventImage: null }));
    } catch (error) {
      alert(error.message);
    } finally {
      setActionLoading(prev => ({ ...prev, event: false }));
    }
  };

  // Send Notification
  const sendNotification = async () => {
    if (!form.notificationText) return alert("Write a message");
    try {
      setActionLoading(prev => ({ ...prev, notification: true }));
      const { error } = await supabase.from("notifications").insert([{ message: form.notificationText }]);
      if (error) throw error;
      alert("Notification sent!");
      setForm(prev => ({ ...prev, notificationText: "" }));
    } catch (error) {
      alert(error.message);
    } finally {
      setActionLoading(prev => ({ ...prev, notification: false }));
    }
  };

  // Update Giving Info
  const updateGiveDetails = async () => {
    try {
      setActionLoading(prev => ({ ...prev, giving: true }));
      const { error } = await supabase.from("give_details").upsert({
        id: 1,
        eco_cash: form.ecoCashNumber,
        visa: form.visaInstructions,
        inbucks: form.inbucksDetails
      });
      if (error) throw error;
      alert("Giving information updated!");
      setForm(prev => ({ ...prev, ecoCashNumber: "", visaInstructions: "", inbucksDetails: "" }));
    } catch (error) {
      alert(error.message);
    } finally {
      setActionLoading(prev => ({ ...prev, giving: false }));
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
      <LoadingSpinner />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <h1 className="text-4xl text-purple-400 font-bold mb-10 border-b pb-4 border-gray-600">
        Admin Dashboard
      </h1>

      {/* Upload Sermon */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-yellow-300 flex items-center gap-2">
          <FaVideo /> Upload Sermon
        </h2>
        <input
          type="text"
          name="sermonTitle"
          placeholder="Sermon Title"
          onChange={handleChange}
          value={form.sermonTitle}
          className="input"
          disabled={actionLoading.sermon}
        />
        <input
          type="file"
          accept="video/*"
          onChange={(e) => handleFileChange(e, "sermonVideo")}
          className="input mt-2"
          disabled={actionLoading.sermon}
        />
        <button
          onClick={uploadSermon}
          disabled={actionLoading.sermon}
          className="btn mt-2 flex items-center gap-2 justify-center"
        >
          {actionLoading.sermon ? <LoadingSpinner /> : <FaUpload />}
          {actionLoading.sermon ? "Uploading..." : "Upload Sermon"}
        </button>

        {/* Show recent sermons */}
        {sermons.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Recent Sermons</h3>
            <ul className="space-y-2 max-h-48 overflow-y-auto">
              {sermons.map(({ id, title, video_url }) => (
                <li key={id} className="bg-gray-800 p-3 rounded flex items-center justify-between">
                  <span>{title}</span>
                  <a
                    href={supabase.storage.from("sermons").getPublicUrl(video_url).data.publicUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-yellow-400 underline"
                  >
                    Watch
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* Upload Event */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-green-300 flex items-center gap-2">
          <FaImage /> Upload Event Photo
        </h2>
        <input
          type="text"
          name="eventTitle"
          placeholder="Event Title"
          onChange={handleChange}
          value={form.eventTitle}
          className="input"
          disabled={actionLoading.event}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleFileChange(e, "eventImage")}
          className="input mt-2"
          disabled={actionLoading.event}
        />
        <button
          onClick={uploadEvent}
          disabled={actionLoading.event}
          className="btn mt-2 flex items-center gap-2 justify-center"
        >
          {actionLoading.event ? <LoadingSpinner /> : <FaUpload />}
          {actionLoading.event ? "Uploading..." : "Upload Event"}
        </button>

        {/* Show recent events */}
        {events.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Recent Events</h3>
            <ul className="space-y-2 max-h-48 overflow-y-auto">
              {events.map(({ id, title, image_url }) => (
                <li key={id} className="bg-gray-800 p-3 rounded flex items-center justify-between">
                  <span>{title}</span>
                  <a
                    href={supabase.storage.from("events").getPublicUrl(image_url).data.publicUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-400 underline"
                  >
                    View Image
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* Notifications */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-pink-300 flex items-center gap-2">
          <FaBell /> Send Notification
        </h2>
        <textarea
          name="notificationText"
          placeholder="Write a notification..."
          onChange={handleChange}
          value={form.notificationText}
          className="input h-24"
          disabled={actionLoading.notification}
        />
        <button
          onClick={sendNotification}
          disabled={actionLoading.notification}
          className="btn mt-2 flex items-center gap-2 justify-center"
        >
          {actionLoading.notification ? <LoadingSpinner /> : <FaUpload />}
          {actionLoading.notification ? "Sending..." : "Send Notification"}
        </button>
      </section>

      {/* Giving Info */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-blue-300 flex items-center gap-2">
          <FaDollarSign /> Update Giving Info
        </h2>
        <input
          name="ecoCashNumber"
          placeholder="EcoCash Number"
          onChange={handleChange}
          value={form.ecoCashNumber}
          className="input"
          disabled={actionLoading.giving}
        />
        <input
          name="visaInstructions"
          placeholder="Visa Instructions"
          onChange={handleChange}
          value={form.visaInstructions}
          className="input mt-2"
          disabled={actionLoading.giving}
        />
        <input
          name="inbucksDetails"
          placeholder="Inbucks Code"
          onChange={handleChange}
          value={form.inbucksDetails}
          className="input mt-2"
          disabled={actionLoading.giving}
        />
        <button
          onClick={updateGiveDetails}
          disabled={actionLoading.giving}
          className="btn mt-2 flex items-center gap-2 justify-center"
        >
          {actionLoading.giving ? <LoadingSpinner /> : <FaUpload />}
          {actionLoading.giving ? "Updating..." : "Update Info"}
        </button>
      </section>
    </div>
  );
}
