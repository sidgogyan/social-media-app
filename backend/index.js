const express=require("express");
const app=express();
const dotenv=require('dotenv');
const morgan=require('morgan');
const helmet=require('helmet');
const mongoose=require('mongoose');
const userRoute=require("./routes/users");
const authRoute=require("./routes/auth");
const postRoute=require("./routes/posts");
const multer=require("multer")
const cors=require('cors');
app.use(cors());
const path=require("path")

dotenv.config();

let filename=""

const storage=multer.diskStorage({
   
    destination:(req,file,cb)=>{
         filename=req.body.name;
        cb(null,"public/images");
    },
    filename:(req,file,cb)=>{
     
        cb(null,filename);
    }
})

const upload=multer({storage});
app.post("/api/upload",upload.single("file"),(req,res)=>{
    try{
             return res.status(200).json("file uploaded sucessfully")
    }
    catch(err){
        console.log(err);
    }
})


app.use("/images",express.static(path.join(__dirname,"public/images")))

//db connection
mongoose.connect(process.env.MONGO_URL,
    {useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:true,
useUnifiedTopology:true}).then(()=>{
    console.log("connected");
}).catch((e)=>{
    console.log("mongodb error")
});

//middleware

app.use(express.json());
app.use(helmet());
app.use(morgan("common"))


//routes

app.use("/api/user",userRoute);
app.use("/api/auth",authRoute);
app.use("/api/post",postRoute);




app.listen(8080,()=>{
    console.log("server is running")
})