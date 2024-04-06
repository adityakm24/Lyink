import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import Navbar from "./Navbar";
import styles from "./assets/createlink.module.css";
import Link from "next/link";

export default function Dashboard() {
  const [destination, setDestination] = useState("");
  const [title, setTitle] = useState("");
  const [customDomain, setCustomDomain] = useState("");
  const [shortUrls, setShortUrls] = useState([]);
  const { data: session, status } = useSession();

  const handleFetchCurrentUrl = async () => {
    try {
      const currentUrl = res.data.href;
      setDestination(currentUrl);
    } catch (error) {
      console.error("Error fetching current URL:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Form validation: Ensure valid URL format for "Destination URL"
      const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
      if (!urlRegex.test(destination)) {
        throw new Error("Please enter a valid URL");
      }

      const response = await fetch("/api/shorten", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          originalUrl: destination,
          title,
          customDomain,
        }),
      });
      if (response.ok) {
        setShortUrls((prevUrls) => [
          ...prevUrls,
          { originalUrl: destination, title, customDomain },
        ]);
        setDestination("");
        setTitle("");
        setCustomDomain("");
      } else {
        throw new Error("Failed to shorten URL");
      }
    } catch (error) {
      console.error("Error shortening URL:", error);
    }
  };

  const handleSignIn = async () => {
    await signIn();
  };

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session) {
    return (
      <p>
        You are not signed in. <button onClick={handleSignIn}>Sign in</button>
      </p>
    );
  }

  return (
    <div>
      <Navbar userName={session.user.name} userImage={session.user.image} />
      <div className={styles.container}>
        <Link href="/dashboard">Home</Link>
        <div>
          <p className={styles.heading1}>Create New</p>
        </div>
        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.heading}>Destination URL:</label>
          <input
            type="url" // Use "url" type for validating URLs
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Enter URL"
            required
          />
          <button
            type="button"
            onClick={handleFetchCurrentUrl}
            className={styles.fetchUrlButton}
          >
            Fetch Current URL
          </button>
          <label className={styles.heading}>Title (Optional):</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
          />
          <label className={styles.heading}>Custom Domain (Optional):</label>
          <input
            type="text"
            value={customDomain}
            onChange={(e) => setCustomDomain(e.target.value)}
            placeholder="Custom Domain"
          />
          <button type="submit">Shorten</button>
        </form>
      </div>
    </div>
  );
}
