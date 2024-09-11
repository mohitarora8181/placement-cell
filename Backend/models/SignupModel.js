import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    fullname: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    refreshToken: {
        type: String
    },
    dob: {
        type: Date,
        required: true
    },
    degree: {
        type: String,
        required: true
    },
    course: {
        type: String,
        required: true
    },
    twelfthPercentage: {
        type: Number
    },
    diplomaPercentage: {
        type: Number
    },
    nationality: {
        type: String,
        required: true
    },
    cgpa: {
        type: Number,
        required: true
    },


    tenthPercentage: {
        type: Number
    },
    gapYear: {
        type: Number
    },
    yearOfPassing: {
        type: Number
    },
    resumeURL: {
        type: String,
        trim: true
    },
    appliedJobs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Job'
        }
    ],
    activeBacklogs: {
        type: Number
    },
    contactNumber: {
        type: String,
        required: true,
        trim: true
    },

    linkedIn:{
      type:String,
      required:true
    },
    leetCode:{
      type:String,
      required:true,
    },
    github:{
      type:String,
      required:true,
    },
    portfolio:{
      type:String,
      required:true,
    },

    backlogsCleared:{
      type: String,
      required: true,
    },
    state:{
      type: String,
      required: true
    },
    city:{
      type:String,
      required: true,
    },

    isAdmin: {
      type: Boolean,
      default: false
  },

}, {
    timestamps: true
});


userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    console.log('Hashing password:', this.password);
    this.password = await bcrypt.hash(this.password, 10);
    console.log('Hashed password:', this.password);
    next();
});
userSchema.methods.matchPassword = async function (enteredPassword) {

    return await bcrypt.compare(enteredPassword, this.password);
};



const User = mongoose.model('User', userSchema);

export default User;
