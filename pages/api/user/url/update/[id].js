// Import necessary dependencies and models
import ShortUrl from "../../../../../models/shortUrl";
import dbConnect from "../../../../../utils/dbConnect";

export default async function handler(req, res) {
  await dbConnect();
  if (req.method === "PUT") {
    const { id } = req.query; // Extract the URL ID from the request query
    const { title, originalUrl } = req.body; // Extract updated data from the request body

    try {
      // Find the URL by ID and update its data
      const updatedUrl = await ShortUrl.findByIdAndUpdate(
        id,
        { title, originalUrl },
        { new: true }
        );

      // Check if the URL exists and return the updated data
      if (updatedUrl) {
        return res.status(200).json(updatedUrl);
      } else {
        return res.status(404).json({ error: "URL not found" });
      }
    } catch (error) {
      console.error("Error updating URL:", error);
      return res.status(500).json({ error: "Server Error" });
    }
  } else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}
