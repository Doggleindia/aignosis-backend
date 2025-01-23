import mongoose from 'mongoose';

const childOffer= new mongoose.Schema(
    {
        name: {type:String, required: true},
        phoneNumber: {type:String, required:true}
    }
);

const offerModel=mongoose.model('offer',childOffer);

export default offerModel;