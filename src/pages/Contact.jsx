import React, { useState } from "react";
import { FaEnvelope, FaWhatsapp, FaPhone } from "react-icons/fa";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Add your form submission logic here (e.g., send to backend or email service)
    setSubmitted(true);
  };

  return (
    <div className="max-w-md mx-auto p-6 text-white">
      <h1 className="text-4xl font-bold text-purple-400 mb-6 text-center">
        Contact Us
      </h1>

      <div className="mb-8 space-y-6 bg-gray-900 rounded-lg p-6 shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 text-purple-300">
          Reach out anytime
        </h2>

        <div className="flex items-center gap-3">
          <FaEnvelope className="text-purple-500 text-xl" />
          <a
            href="mailto:info@victorypowerintl.com"
            className="hover:text-purple-400"
          >
            info@victorypowerintl.com
          </a>
        </div>

        <div className="flex items-center gap-3">
          <FaWhatsapp className="text-green-500 text-xl" />
          <a
            href="https://wa.me/263712345678"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-green-400"
          >
            +263 71 234 5678
          </a>
        </div>

        <div className="flex items-center gap-3">
          <FaPhone className="text-blue-500 text-xl" />
          <a href="tel:+26312345678" className="hover:text-blue-400">
            +263 12 345 678
          </a>
        </div>
      </div>

      {submitted ? (
        <p className="text-green-400 text-center text-lg">
          Thank you for contacting us! We will get back to you shortly.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5 text-left">
          <label className="block">
            <span className="text-gray-300">Name</span>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Your full name"
              className="w-full mt-1 p-3 rounded bg-gray-800 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </label>

          <label className="block">
            <span className="text-gray-300">Email</span>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full mt-1 p-3 rounded bg-gray-800 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </label>

          <label className="block">
            <span className="text-gray-300">Message</span>
            <textarea
              name="message"
              rows={4}
              required
              value={formData.message}
              onChange={handleChange}
              placeholder="Write your message here..."
              className="w-full mt-1 p-3 rounded bg-gray-800 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </label>

          <button
            type="submit"
            className="w-full py-3 bg-purple-600 rounded text-white hover:bg-purple-700 transition"
          >
            Send Message
          </button>
        </form>
      )}
    </div>
  );
}
