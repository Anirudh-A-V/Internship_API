import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

const Schema = mongoose.Schema;

const skillSchema = new Schema({
    category: { type: String, required: true },
    skills: [{
      skillCode: { type: String, required: true },
      skillName: { type: String, required: true },
    }],
  });

skillSchema.plugin(passportLocalMongoose);

export default mongoose.model("Skill", skillSchema);