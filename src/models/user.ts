import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

const Schema = mongoose.Schema;

const maxDateForAge = () => {
    const currentDate = new Date();
    const year16YearsAgo = currentDate.getFullYear() - 16;
    return `${year16YearsAgo}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`;
};

const userSchema = new Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    userType: { type: String, required: true },
    firstName: {
        type: String,
        minlength: [2, 'Length should be atleast 2 characters'],
        maxlength: [15, 'Length should not exceed 15 characters'],
    },
    lastName: {
        type: String,
        minlength: [2, 'Length should be atleast 2 characters'],
        maxlength: [15, 'Length should not exceed 15 characters'],
    },
    dob: {
        type: Date,
        max: [maxDateForAge, 'Invalid data! You must be atleast 16.'],
    },
    address: String,
    mobileNum: { type: String, minlength: 10 },
    image: String,
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date, default: Date.now() },
});

userSchema.plugin(passportLocalMongoose);

export default mongoose.model("User", userSchema);