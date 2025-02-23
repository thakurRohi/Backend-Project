import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import jwt from "jsonwebtoken";
const generateAccesAndRefreshTokens = async(userId)=>{
  try {
     const user = await User.findById(userId);
     const accessToken=user.generateAccessToken()
     const refreshToken=user.generateRefreshToken()

     user.refreshToken=refreshToken
     await user.save({validateBeforeSave:false});
     
      return {accessToken,refreshToken}
   

  } catch (error) {
    throw new ApiError(500,"something went wrong while generating refresh and access token");
  }
}
const registerUser = asyncHandler(async (req, res) => {
  try {
    // Destructuring and extraction
    const { fullName, email, username, password } = req.body;
  

    // Checking emptiness of fields
    if ([fullName, email, username, password].some((field) => field?.trim() === "")) {
      throw new ApiError(400, "All fields are required");
    }

    // Checking if user already exists
    const existedUser = await User.findOne({
      $or: [{ username }, { email }]
    });

    if (existedUser) {
      console.log("Existing user found:", existedUser);
      throw new ApiError(409, "User already exists");
    }

    // Extracting file paths
    const avatarLocalPath = req.files?.avatar[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;

    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage)&& req.files.coverImage.length>0){
      coverImageLocalPath = req.files.coverImage[0].path;
    }

    if (!avatarLocalPath) {
      throw new ApiError(400, "Avatar is required");
    }

    // Uploading files to Cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = coverImageLocalPath ? await uploadOnCloudinary(coverImageLocalPath) : null;

    if (!avatar) {
      throw new ApiError(500, "Error in uploading avatar");
    }

    // Creating user object
    const user = await User.create({
      fullName,
      avatar: avatar.url,
      coverImage: coverImage?.url || "",
      email,
      password,
      username: username.toLowerCase()
    });

    // Fetching created user
    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createdUser) {
      throw new ApiError(500, "Error in creating user");
    }

    return res.status(201).json(
      new ApiResponse(200, createdUser, "User registered successfully")
    );
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

const loginUser=asyncHandler(async(req,res)=>{
    //req body->data
    //username or email
    //fidn user
    //password check 
    //acces and refresh token
    //send cookie

    const {email,username,password}=req.body
    console.log(email)
    if(!username && !email){
      throw new ApiError(400,"Username or email is required")
    }

   const user = await User.findOne({
      $or:[{username},{email}]
    })

    if(!user){
      throw new ApiError(404,"User not found")
    }

   const isPasswordValid =  await user.isPasswordCorrect(password);

   if(!isPasswordValid){
     throw new ApiError(401,"Invalid password")
   }

  const {accessToken,refreshToken}=await generateAccesAndRefreshTokens(user._id)
  
 const loggedInUser =  await User.findById(user._id).select("-password -refreshToken")

 const options={
  httpOnly:true,
  secure:true
 }

 return res
 .status(200)
 .cookie("accessToken",accessToken,options)
 .cookie("refreshToken",refreshToken,options)
 .json(new ApiResponse(
  200,
  {
  user:loggedInUser,accessToken,
  refreshToken
 },
 "user logged in successfully"
)
)

})

const logoutUser=asyncHandler(async(request,res)=>{
      await User.findByIdAndUpdate(
    request.user._id,
    {
      $set:{
        refreshToken:undefined
      }
    },
    {
      new:true
    }

   )

   const options={
    httpOnly:true,
    secure:true,
    
   };

   return res.status(200)
   .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200,{},"User logged out successfully"))
})

const refreshAccessToken=asyncHandler(async(req,res)=>{
   const incommingRefreshToken =  req.cookies.refreshToken || req.body.refreshToken

   if(incommingRefreshToken){
    throw new ApiError(401,"unauthrized request")
   }

   try {
    const decodedToken = jwt.verify(incommingRefreshToken , process.env.REFRESH_TOKEN_SECRET)
   
    const user = User.findById(decodedToken?._id)
    if(!user){
     throw new ApiError(401,"invalid refreh token")
    }
 
    if(incommingRefreshToken!=user?._refreshToken){
     throw new ApiError(401,"refresh token expired or used")
    }
 
    const options={
     httpOnly:true,
     secure:true
    }
 
    const {accessToken,newRefreshToken}=await generateAccesAndRefreshTokens(user._id)
    return res.status(200)
    .cookie("accesToeken",accessToken,options)
    .cookie("newRefreshToken",options)
    .json(
     new ApiResponse(
       200,
       {
         accessToken,
         refreshToekn :newRefreshToken,
 
       },
       "accestoken refreshed"
     )
    )
   } catch (error) {
     throw new ApiError(401,error?.message || "invalid refresh token")
   }
})

export { registerUser };
export { loginUser,
  logoutUser,
  refreshAccessToken
};