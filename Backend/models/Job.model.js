import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  jobTitle: {
    type: String,
    required: true,
    trim: true,
  },
  companyName: {
    type: String,
    required: true,
    trim: true,
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String, 
    required: true,
    trim: true,
  },
  jobDescription: {
    type: String,
    required: true,
    trim: true,
  },
  ctc: {
    type: Number, 
    required: true,
  },
  imageURL: {
    type: String,
    required: true,
    trim: true,
  },
  applyurl:{
    type:String,
    required:true,
  },
  applicants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
  }],
}, {
  timestamps: true, 
});

const Job = mongoose.model('Job', jobSchema);

export default Job
