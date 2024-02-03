import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async ()=>{
    try {
      const coonnectionInstance =  await mongoose.connect(`${process.env.MONGODB_URI}/{DB_NAME}`)
      console.log(`.\n MongoDB Connected !! DB HOST ${coonnectionInstance.connection.host}`); 
    } catch (error) {
        console.error("MONGODB coonnection FAILED ",error); 
        process.exit(1)
    }
}

export default connectDB