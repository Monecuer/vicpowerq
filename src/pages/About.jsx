import React from "react";

export default function About() {
  return (
    <div className="p-6 max-w-4xl mx-auto prose prose-invert">
      <h1 className="text-purple-400 mb-4">About Victory Power International Ministries</h1>
      <p>
        Victory Power International Ministries (VPIC) is a dynamic and Spirit-led church committed to
        transforming lives through the gospel of Jesus Christ.
      </p>
      <p>
        Founded in 2000, VPIC has grown into a vibrant community focused on worship, discipleship,
        outreach, and service to the community.
      </p>
      <h2 className="mt-8">Our Vision</h2>
      <p>
        To see lives transformed by the power of the Holy Spirit, impacting families, communities, and nations.
      </p>
      <h2 className="mt-8">Our Mission</h2>
      <ul className="list-disc list-inside">
        <li>Proclaim the Gospel boldly</li>
        <li>Equip believers for ministry</li>
        <li>Serve the poor and needy</li>
        <li>Build strong families and communities</li>
      </ul>
    </div>
  );
}
