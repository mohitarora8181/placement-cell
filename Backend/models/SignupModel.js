import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        index: true
    },
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
    sgpa1: {
        type: Number
    },
    sgpa2: {
        type: Number
    },
    sgpa3: {
        type: Number
    },
    sgpa4: {
        type: Number
    },
    sgpa5: {
        type: Number
    },
    sgpa6: {
        type: Number
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
    address: {
        type: String,
        required: true
    },
    school12th: {
        type: String
    },
    tenthPercentage: {
        type: Number
    },
    gapYear: {
        type: Number
    },
    specialisation: {
        type: String
    },
    yearOfPassing: {
        type: Number
    },
    backlogs1: {
        type: Number
    },
    backlogs2: {
        type: Number
    },
    backlogs3: {
        type: Number
    },
    backlogs4: {
        type: Number
    },
    backlogs5: {
        type: Number
    },
    backlogs6: {
        type: Number
    },
    resumeURL: {
        type: String,
        trim: true
    },
    appliedJobs:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: 'Job'
        }
    ]
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
    console.log('Comparing enteredPassword:', enteredPassword, 'with hashedPassword:', this.password);
    return await bcrypt.compare(enteredPassword, this.password);
};



const User = mongoose.model('User', userSchema);

export default User;
