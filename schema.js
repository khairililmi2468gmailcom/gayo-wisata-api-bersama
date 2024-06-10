import mongoose from "mongoose";

const tourismSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  address: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
});

const Tourism = mongoose.model("Tourism", tourismSchema);
export default Tourism;
