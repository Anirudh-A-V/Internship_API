import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const statsSchema = new Schema({
    providerId: { type: ObjectId, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    image: String,
    recruits: { type: Number, required: true, default: 0 },
});

statsSchema.plugin(passportLocalMongoose);

export default mongoose.model("Stats", statsSchema);