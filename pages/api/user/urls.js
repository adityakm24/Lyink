import dbConnect from "../../../utils/dbConnect";
import ShortUrl from "../../../models/shortUrl";
import { getServerSession } from "next-auth/next";
import nextAuthConfig from "../auth/[...nextauth].js"; // Ensure this path is correct

export default async function handler(req, res) {
  await dbConnect();

  try {
    // Retrieve the session; include your NextAuth config
    const session = await getServerSession(req, res, nextAuthConfig);
    if (!session || !session.user || !session.user.email) {
      console.error("Session or user email not found:", session);
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Use the user's email to query your ShortUrl collection
    // Ensure that your ShortUrl model has a field that stores the user's email (e.g., userEmail)
    const userEmail = session.user.email;
    const urls = await ShortUrl.find({ userEmail: userEmail });
    res.status(200).json(urls);
  } catch (error) {
    console.error("Error fetching user URLs:", error);
    res.status(500).json({ error: "Server error" });
  }
}
