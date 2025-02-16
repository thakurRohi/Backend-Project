import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {User} from "../models/User.models.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js"
const registerUser=asyncHandler(async(req,res)=>{
      // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return response

    //1.
    //destructuring and extraction
    const{fullName,email,username , password}=req.body
    console.log("email: " , email)

    //2. checking emptyness of email
    if(
        [fullName,email,username,password].some((field)=>
            field?.trim()==="" )
    ){
        throw new ApiError(400,"All fields are required")
    }


    //3.
    const existedUser=User.findOne({
        $or:[{userName},{email}]
    })

    if(existedUser){
        throw new ApiError(409 ,"User already exists")
    }


    //4. 
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar is required")
    }

    //5. 
   const avatar= await uploadOnCloudinary(avatarLocalPath)
    const coverImage= await uploadOnCloudinary(coverImageLocalPath)

    //6. )
    if(!avatar){
        throw new ApiError(500, "Error in uploading avatar")
    }

    //7. 
    const user = await User.create({
        fullName,
        avatar:avatar.url,
        coverImage:coverImage?.url||"",
        email,
        password,
        username:username.toLowerCase()
    })

    //8.
   const createdUser = await  User.findById(user._id).select(
    "-password -refreshToken"
   )

   if(!createdUser){
    throw new ApiError(500, "Error in creating user")
   }

    return res.status(201).json(
        new ApiResponse(200,createdUser , "user registered successfully")
    )
});


export {registerUser}