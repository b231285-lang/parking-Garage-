import mongoose from 'mongoose';
const schema=new mongoose.Schema({garageId:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},spotType:{type:String,enum:['compact','standard','ev'],required:true},firstHour:{type:Number,required:true},extraHour:{type:Number,required:true},dailyCap:{type:Number,required:true},source:{type:String,default:'cleaned-import'}},{timestamps:true});
schema.index({garageId:1,spotType:1},{unique:true});
export default mongoose.model('RateCard',schema);
