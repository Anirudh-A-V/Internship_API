import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const seekerSchema = new Schema({
    userId: { type: ObjectId, required: true },
    skills: [String],
    jobs: [String],
    resume: String,
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date, default: Date.now() },
});

seekerSchema.plugin(passportLocalMongoose);

export default mongoose.model("Seeker", seekerSchema);