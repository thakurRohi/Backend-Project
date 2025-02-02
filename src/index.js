// importing dotenv shoul dbe the first thing that has to be happended . because we want as soon as our app loads
/// we want that all the environment variables are available to all files . 
// require('dotenv').config({path: './env'}) 
// doing like this breaks the consistency of code . so in order to prevent
//it , do as following :-
//1.import dotenv from "dotenv"
//2. dotenv.config({path: './env'}) // this will load the env file and will make it available to the entire application 
//
import dotenv from "dotenv"
import connectDB from "./db/index.js";// before it was ./db but it will throw error when run dev . to resolve this 
// error we will add ./db/index.js


dotenv.config({
    path: './.env'
})

//then finally call the db connection
connectDB()
// async await gives promises in return so:--

// till now our db is connected but still our app is not listening . therefore we will do app.listen
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    })
})
.catch((err)=>{
    console.log("Mongo DB connection failed: ",err)
})
// now we are going to try the 2nd approach , as in the first approach a lot of index file has been poluted.
// we will try to make it clean and more readable by creating a new file and importing the required files in it.




















// const app = express()
// // iffies 
// ( async () => {
//     try {
// // imported DB URI from env file alogn with it name specified in constant file 
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
// // listners provided by express to catch errors duiring DB connections and throw them 
//         app.on("errror", (error) => {
//             console.log("ERRR: ", error);
//             throw error
//         })
// // deafult listner 
//         app.listen(process.env.PORT, () => {
//             console.log(`App is listening on port ${process.env.PORT}`);
//         })

//     } catch (error) {
//         console.error("ERROR: ", error)
//         throw err
//     }
// })()