import mongoose, {Schema} from "mongoose";
// this will solve the problem of encrypting confidential information such as passwords . while passing pasword as a
// string ,now using bcrypt we can hash the password and store it in the database
import bcrypt from "bcrypt"
//jwt is a bearer token. whosever posesses it , db sends the data to that person . it is a token based authentication
import jwt from "jsonwebtoken"

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true, 
            index: true // if you want to make searching field more searchable then make index true 
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowecase: true,
            trim: true, 
        },
        fullName: {
            type: String,
            required: true,
            trim: true, 
            index: true
        },
        avatar: {
            type: String, // cloudinary url , we can upload our pics or any other data to aws like services that is 
// cloudinary . after that it provides a url 
            required: true,
        },
        coverImage: {
            type: String, // cloudinary url
        },
        watchHistory: [
            {
                type: Schema.Types.ObjectId,// this will contain an array of objects of the user ids so that we
// can keep track of the user history
                ref: "Video"
            }
        ],
        password: {
            type: String,
            required: [true, 'Password is required']
        },
        refreshToken: {
            type: String
        }

    },
    {
        timestamps: true  // created at , updated at
    }
)

// this is a prehook given by mongoose . anytime before saving the data to the database we can do some operations
// specified in the hook just before data gets saved to the database
// "save " is an event 
// writting csllback should be avoided because callbackk functions do not have this reference . therefore due to lack
//of context we dont use it . also it is aynch beacuse cryption of data i sgoing to take some time .
//next is flag of middleware . after the execution is done , middleware has to call next flag to increment it further .

userSchema.pre("save", async function (next) {
// this is to prevent password getting crypted redundantly whenver we are going to save functionality 
// therefore it only crypts the data when activity is related to password 
    if(!this.isModified("password")) return next();
// whenever password field is getting saved , etxract password from that field and save it ,
    this.password = await bcrypt.hash(this.password, 10)
    next()
})
// passord matching with encrypted datd
userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
   
}

//generatinh refresh and access token
userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}
export const User = mongoose.model("User", userSchema)