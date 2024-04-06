import React from "react";

import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import Navbar from "./Navbar"; // Adjust this import according to your project structure
import styles from "./assets/dashboard.module.css"; // Adjust this import according to your project structure
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencilAlt,
  faLink,
  faChartSimple,
  faCalendarDays,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

export default function Dashboard() {
  const [shortUrls, setShortUrls] = useState([]);
  const { data: session, status } = useSession();
  const [editUrl, setEditUrl] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    originalUrl: "",
  });

  useEffect(() => {
    if (status === "authenticated") {
      fetchUserUrls();
    }
  }, [status]);

  const fetchUserUrls = async () => {
    try {
      const response = await fetch("/api/user/urls", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Necessary for including session cookie in request
      });
      if (response.ok) {
        const urls = await response.json(); // Directly using the array from the response
        setShortUrls(urls); // Expecting the array itself from the API
      } else {
        throw new Error("Failed to fetch user URLs");
      }
    } catch (error) {
      console.error("Error fetching user URLs:", error);
    }
  };

  const deleteUrl = async (urlId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this URL?"
    );
    if (!confirmed) return;

    try {
      const response = await fetch(`/api/user/url/${urlId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (response.ok) {
        // Remove the deleted URL from the state
        setShortUrls((prevUrls) => prevUrls.filter((url) => url._id !== urlId));
        console.log("URL deleted successfully");
      } else {
        throw new Error("Failed to delete URL");
      }
    } catch (error) {
      console.error("Error deleting URL:", error);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Link copied!");
  };

  const handleEdit = (url) => {
    setEditUrl(url);
    setFormData({
      title: url.title || "",
      originalUrl: url.originalUrl || "",
    });
  };

  const handleCancelEdit = () => {
    setEditUrl(null);
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`/api/user/url/update/${editUrl._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData), // Send the updated data in the request body
      });
      if (response.ok) {
        const updatedUrl = await response.json(); // Get the updated URL data from the response
        console.log("URL updated successfully:", updatedUrl);
        // Update the state with the updated URL data if necessary
        // For example, you can update the shortUrls state with the updated URL
      } else {
        throw new Error("Failed to update URL");
      }
    } catch (error) {
      console.error("Error updating URL:", error);
    } finally {
      setEditUrl(null); // Close the edit popup
    }
  };

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session) {
    return (
      <p>
        You are not signed in. <button onClick={() => signIn()}>Sign in</button>
      </p>
    );
  }

  return (
    <div>
      <Navbar userName={session.user.name} userImage={session.user.image} />
      <div className={styles.container}>
        <Link href="/createLink">
          <button>Create Link</button>
        </Link>
        <div className={styles.urls}>
          <h2>Your Links</h2>
          <div className={styles.cardContainer}>
            {shortUrls
              .slice()
              .reverse()
              .map((url) => (
                <div key={url._id} className={styles.card}>
                  <h3 className={styles.title}>
                    <Link
                      href={`/LinkDetails?linkId=${url._id}`}
                      passHref
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.link}
                    >
                      {url.title || "Untitled"}
                    </Link>
                  </h3>
                  <p className={styles.shortUrl}>
                    <Link
                      href={url.shortUrl}
                      passHref
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.link}
                    >
                      {url.shortUrl}
                    </Link>
                  </p>
                  <p className={styles.originalUrl}>
                    <Link
                      href={url.originalUrl}
                      passHref
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.link}
                    >
                      {url.originalUrl.slice(0, 40)}{" "}
                      {/* Displaying only the first 40 characters */}
                      {
                        url.originalUrl.length > 40 &&
                          "..." /* Add ellipsis if the original URL is longer than 40 characters */
                      }
                    </Link>
                  </p>
                  <div className={styles.buttonContainer}>
                    <button
                      style={{ backgroundColor: "red", color: "white" }}
                      className={styles.squareButton}
                      onClick={() => deleteUrl(url._id)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>

                    <button
                      className={styles.squareButton}
                      onClick={() => handleEdit(url)}
                    >
                      <FontAwesomeIcon icon={faPencilAlt} />
                    </button>
                    <button
                      style={{ backgroundColor: "blue", color: "white" }}
                      className={styles.squareButton}
                      onClick={() => copyToClipboard(url.shortUrl)}
                    >
                      <FontAwesomeIcon icon={faLink} />
                    </button>
                  </div>
                  <div className={styles.engagements}>
                    <p>
                      <FontAwesomeIcon icon={faChartSimple} /> Clicks:{" "}
                      {url.engagements}{" "}
                    </p>
                    <p>
                      <FontAwesomeIcon icon={faCalendarDays} />{" "}
                      {new Date(url.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
          </div>
          {shortUrls.length === 0 && <p>Create a link to get started!</p>}
          {editUrl && (
            <div>
              <div className={styles.overlay}></div>
              <div className={styles.editPopup}>
                <h2>Edit URL</h2>
                <form onSubmit={handleUpdate}>
                  <label>Title:</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                  />
                  <label>Original URL:</label>
                  <input
                    type="text"
                    value={formData.originalUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, originalUrl: e.target.value })
                    }
                  />
                  <button type="submit">Update</button>
                  <button onClick={handleCancelEdit}>Cancel</button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
