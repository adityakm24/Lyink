import mongoose from "mongoose";

const dailyClicksSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  clicks: { type: Number, default: 0 },
});

const shortUrlSchema = new mongoose.Schema({
  userEmail: String,
  originalUrl: String,
  shortId: String,
  shortUrl: String,
  title: String,
  destination: String,
  customDomain: String,
  createdAt: { type: Date, default: Date.now },
  dailyClicks: [dailyClicksSchema],
  totalClicks: { type: Number, default: 0 },
});

// Check if mongoose.models is defined, otherwise define it as an empty object
if (!mongoose.models) {
  mongoose.models = {};
}

// Check if the model exists before calling `mongoose.model`
// This prevents the model from being compiled multiple times
const ShortUrl =
  mongoose.models.ShortUrl || mongoose.model("ShortUrl", shortUrlSchema);

export default ShortUrl;
