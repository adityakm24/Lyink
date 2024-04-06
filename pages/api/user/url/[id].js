import dbConnect from "../../../../utils/dbConnect";
import ShortUrl from "../../../../models/shortUrl";

export default async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;

  await dbConnect();

  switch (method) {
    case "DELETE":
      try {
        const deletedUrl = await ShortUrl.findByIdAndDelete(id);
        if (!deletedUrl) {
          return res
            .status(404)
            .json({ success: false, message: "URL not found" });
        }
        res.status(200).json({ success: true, data: {} });
      } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
      }
      break;
    default:
      res
        .status(405)
        .json({ success: false, message: `Method ${method} Not Allowed` });
      break;
  }
}
