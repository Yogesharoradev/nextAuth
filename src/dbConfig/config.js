import mongoose from 'mongoose'

 const connect = async ()=>{
    try{
       mongoose.connect(process.env.MONGO_URI ,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
       })
       const connection = mongoose.connection

       connection.on("connected" , ()=>{
        console.log("conneceted to mongodb")
       })

       connection.on("error" , ()=>{
        console.log("error in connecting to mongodb")
       })
        

    }catch(err){
        console.log(`db is not connected`)
        console.log(err)
    }
}

export default connect
