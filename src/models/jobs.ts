import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const jobSchema = new Schema({
    description: { type: String, required: true },
    salary: {
        minSalary: { type: Number, min: 0 },
        maxSalary: { type: Number, min: 0 },
    },
    requiredSkills: [String],
    applicants: [ObjectId],
    selected: [ObjectId],
    hired: [ObjectId],
    designation: { type: String, required: true },
    location: { type: String, required: true },
    type: { type: String, required: true },
    experience: {
        minYears: { type: Number, min: 0 },
        maxYears: { type: Number, min: 0 },
    },
    providerId: { type: ObjectId, required: true },
    active: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date, default: Date.now() },
});

jobSchema.plugin(passportLocalMongoose);

export default mongoose.model("Job", jobSchema);