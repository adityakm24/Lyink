// pages/index.js
import { useSession, signIn } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    // If the user is already signed in, redirect to the dashboard
    if (session) {
      router.push("/dashboard"); // Adjust "/dashboard" if your dashboard route differs
    }
  }, [session, router]);

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "0 auto",
        textAlign: "center",
        padding: "20px",
      }}
    >
      <h1>Welcome to Lyink</h1>
      <p>The smart way to shorten URLs.</p>
      {!session && (
        <>
          <button
            onClick={() => signIn()}
            style={{ padding: "10px 20px", cursor: "pointer" }}
          >
            Sign in to get started
          </button>
          <p style={{ marginTop: "20px" }}>
            Sign in to create and manage your short URLs.
          </p>
        </>
      )}
    </div>
  );
}
