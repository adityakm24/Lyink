import ShortUrl from "../../models/shortUrl";
import dbConnect from "../../utils/dbConnect";

export default async function handler(req, res) {
  await dbConnect();
  if (req.method === "POST") {
    const { shortUrl } = req.body;
    if (!shortUrl) {
      return res.status(400).json({ error: "Short URL is required" });
    }

    try {
      // Query the database for the short URL
      let url = await ShortUrl.findOne({ shortId: shortUrl });
      if (!url) {
        return res.status(404).json({ error: "Short URL not found" });
      }

      // Increment totalClicks
      url.totalClicks += 1;

      // Update dailyClicks
      const today = new Date().setHours(0, 0, 0, 0);
      const index = url.dailyClicks.findIndex(
        (entry) => entry.date.getTime() === today
      );
      if (index !== -1) {
        url.dailyClicks[index].clicks += 1;
      } else {
        url.dailyClicks.push({ date: today, clicks: 1 });
      }

      // Save the updated URL model
      await url.save();

      // If the URL is found, return the entire URL info
      return res.status(200).json(url);
    } catch (error) {
      // Handle database errors
      console.error("Error:", error);
      return res.status(500).json({ error: "Server Error" });
    }
  } else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}
