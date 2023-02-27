const mongoose=require('mongoose');
// const mongoURI="mongodb+srv://inotebook:myhosting@cluster0.xtg8iqn.mongodb.net/?retryWrites=true&w=majority";
const mongoURI="mongodb+srv://atlas_db:myhosting123@cluster0.heoau7s.mongodb.net/?retryWrites=true&w=majority";
const connectToMongo=()=>{
    mongoose.connect(mongoURI).then(()=>{
        console.log('connection successful');
      }).catch((err)=>console.log('no connection'));
}
module.exports=connectToMongo;

