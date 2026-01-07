import mongoose from "mongoose";

const connectDb=async()=>{
    try{
        mongoose.connection.on('connected',()=>{
            console.log("MongoDB connected successfully");
        });

        let mongoDbURI=process.env.MONGODB_URI;
        const projectName='resume-builder';
        if(!mongoDbURI){
            throw new Error("MongoDB URI not found in environment variables");
        }
        if(mongoDbURI.endsWith('/')){
            mongoDbURI=mongoDbURI.slice(0,-1);
        }
        await mongoose.connect(`${mongoDbURI}/${projectName}`)
    }
    catch(error){
        console.error("Error connecting to MongoDB:",error.message);
    }
}

export default connectDb;