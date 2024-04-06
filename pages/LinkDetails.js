import { useRouter } from "next/router";
import ShortUrl from "../models/shortUrl";
import { format } from "date-fns";
import React from "react";
import dbConnect from "@/utils/dbConnect";
import styles from "./assets/LinkDetails.module.css"; // Import CSS styles
import Chart from "chart.js/auto";
import { Line } from "react-chartjs-2";

export default function LinkDetails({ linkDetails }) {
  const router = useRouter();
  const { linkId } = router.query;

  // Check if linkDetails is null or not fully populated
  if (!linkDetails || !linkDetails.userEmail) {
    return <p>Loading...</p>;
  }

  // Aggregate clicks per day
  const clicksPerDay = {};
  linkDetails.dailyClicks.forEach((entry) => {
    const dateStr = format(new Date(entry.date), "MM/dd/yyyy");
    if (!clicksPerDay[dateStr]) {
      clicksPerDay[dateStr] = 0;
    }
    clicksPerDay[dateStr] += entry.clicks;
  });

  // Prepare data for the line chart
  const dailyClicksData = {
    labels: Object.keys(clicksPerDay),
    datasets: [
      {
        label: "Daily Clicks",
        data: Object.values(clicksPerDay),
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  return (
    <div className={styles.container}>
      <h1>Link Details</h1>
      <div className={styles.card}>
        <p>
          <strong>Link ID:</strong> {linkId}
        </p>
        <p>
          <strong>User Email:</strong> {linkDetails.userEmail}
        </p>
        <p>
          <strong>Original URL:</strong> {linkDetails.originalUrl}
        </p>
        <p>
          <strong>Short ID:</strong> {linkDetails.shortId}
        </p>
        <p>
          <strong>Short URL:</strong>{" "}
          <a
            href={linkDetails.shortUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {linkDetails.shortUrl}
          </a>
        </p>
        <p>
          <strong>Title:</strong> {linkDetails.title}
        </p>
        <p>
          <strong>Custom Domain:</strong> {linkDetails.customDomain || "N/A"}
        </p>
        <p>
          <strong>Created At:</strong>{" "}
          {format(new Date(linkDetails.createdAt), "MM/dd/yyyy, hh:mm:ss a")}
        </p>
        <p>
          <strong>Total Clicks:</strong> {linkDetails.totalClicks}
        </p>
        <div>
          {/* Render the line chart */}
          <h3>Daily Clicks</h3>
          <Line data={dailyClicksData} />
        </div>
      </div>
    </div>
  );
}

// Ensure that the model is imported and exported correctly
export async function getServerSideProps(context) {
  const { linkId } = context.query;

  try {
    // Fetch link details from the database
    await dbConnect(); // Ensure database connection
    const linkDetails = await ShortUrl.findById(linkId);

    if (!linkDetails) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        linkDetails: JSON.parse(JSON.stringify(linkDetails)),
      },
    };
  } catch (error) {
    console.error("Error fetching link details:", error);
    return {
      props: {
        linkDetails: null,
      },
    };
  }
}
