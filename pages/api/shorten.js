// Import necessary utilities from Next.js and NextAuth
import dbConnect from "../../utils/dbConnect";
import ShortUrl from "../../models/shortUrl";
import { getServerSession } from "next-auth/next"; // Corrected import path
import nextAuthConfig from "./auth/[...nextauth].js"; // Adjust this path as needed
import shortid from "shortid";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res
      .setHeader("Allow", ["POST"])
      .status(405)
      .end(`Method ${req.method} Not Allowed`);
  }

  await dbConnect();

  const session = await getServerSession(req, res, nextAuthConfig);
  if (!session || !session.user || !session.user.email) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { originalUrl, title, customDomain } = req.body;
  const userEmail = session.user.email;

  const shortId = shortid.generate();
  const shortUrl = `${customDomain || "http://lyink.com"}/${shortId}`;

  try {
    console.log("Creating ShortUrl with userEmail:", userEmail);
    await ShortUrl.create({
      userEmail,
      originalUrl,
      shortId,
      shortUrl,
      title,
      customDomain,
      createdAt: Date.now(),
    });

    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
}
