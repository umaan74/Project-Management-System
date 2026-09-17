import mongoose from 'mongoose';

async function ConnectDB(){
    try {
       await mongoose.connect(process.env.MONGODB_URI);
        console.log("Database Connected Successfuly")
    } catch (error) {
        console.log("Database Not Connected !\nSomething Went Wrong");
        console.log(error.message);
    }

    //   mongoose
    // .connect(process.env.MONGODB_URI)
    // .then(() => {
    //   console.log("Database Connected Successfuly");
    // })
    // .catch(() => {
    //   console.log("Database Not Connected !\nSomething Went Wrong");
    // });
}
export default ConnectDB;