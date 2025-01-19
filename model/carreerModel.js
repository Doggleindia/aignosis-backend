import mongoose from 'mongoose';

const jobSchema= new mongoose.Schema(
    {
        name: {type:String, required: true},
        mobile: {type:Number, required:true},
        email: {type:String, required:true},
        role: {type:String, required: true},
        experience: {type:String, required: true},
        location: {type:String, required: true},
        message: {type:String},
        fileURL: {type: String, required: true} //This will store the resume or choose file


    }
);

const carreerModel=mongoose.model('career',jobSchema);

export default carreerModel;