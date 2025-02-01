import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";// here an error will also be thrown if we dont add constant.js 

const connectDB = async () => {
    try {
//connection with environment variable , db name is also provided in constant file and alll of these things can 
// stored in variable  that can be returned further .
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
// variable injected and will be providing objects as host and connnection 
/// tells that at what host in db i am connected currently
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("MONGODB connection FAILED ", error);
//process is refrence to current process in node 
        process.exit(1)
    }
}

export default connectDB