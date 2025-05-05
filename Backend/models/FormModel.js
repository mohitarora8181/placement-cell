import mongoose from 'mongoose';

const formSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    formType: {
        type: String,
        required: true,
        enum: ['interview', 'hackathon', 'test', 'general']
    },
    targetAudience: {
        type: String,
        required: true,
        enum: ['all', 'specific'],
        default: 'all'
    },
    departments: [{
        type: String
    }],

    // Interview specific fields
    companyName: {
        type: String,
        trim: true
    },
    jobDescription: {
        type: String
    },
    salaryPackage: {
        type: String,
        trim: true
    },
    location: {
        type: String,
        trim: true
    },

    // Hackathon specific fields
    hackathonPlace: {
        type: String,
        trim: true
    },

    // Test specific fields
    testName: {
        type: String,
        trim: true
    },
    testTimeLocation: {
        type: String,
        trim: true
    },
    testLink: {
        type: String,
        trim: true
    },

    status: {
        type: String,
        default: 'active',
        enum: ['active', 'closed', 'deleted']
    },
}, {
    timestamps: true
});

const Forms = mongoose.model('Forms', formSchema);

export default Forms;