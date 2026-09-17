import mongoose from 'mongoose';
const schema=new mongoose.Schema({ownerId:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},spotNumber:{type:String,required:true,unique:true},floor:{type:Number,required:true},type:{type:String,enum:['compact','standard','ev'],required:true},isOccupied:{type:Boolean,default:false}},{timestamps:true});
export default mongoose.model('Spot',schema);
