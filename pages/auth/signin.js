// pages/auth/signin.js
import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function SignIn() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/");
    }
  }, [session, router]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Sign In</h1>
      <button onClick={() => signIn("google")}>Sign in with Google</button>
      {/* Add more sign in buttons for other providers as needed */}
    </div>
  );
}
