import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) { // cb is callback
        //storing files at specified destination folder
      cb(null, "./public/temp")
    },
    filename: function (req, file, cb) {
      
      cb(null, file.originalname)
    }
  })
  
export const upload = multer({ 
    storage, 
})