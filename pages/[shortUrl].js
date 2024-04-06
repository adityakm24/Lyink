import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function RedirectPage() {
  const router = useRouter();
  const { shortUrl } = router.query;
  const [redirectUrl, setRedirectUrl] = useState(null);
  const [timer, setTimer] = useState(5);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/redirect", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ shortUrl }),
        });
        if (response.ok) {
          const data = await response.json();
          setRedirectUrl(data.originalUrl);
        } else {
          throw new Error("Short URL not found");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    if (shortUrl) {
      fetchData();
    }
  }, [shortUrl]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (timer === 0 && redirectUrl) {
      window.location.href = redirectUrl;
    }
  }, [timer, redirectUrl]);

  return <div>{redirectUrl && <p>Redirecting in {timer} seconds...</p>}</div>;
}
