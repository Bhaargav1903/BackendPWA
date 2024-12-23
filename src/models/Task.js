const mongoose=require('mongoose');

//Task Mongoose Schema
const taskSchema=new mongoose.Schema(
    {
        title:{
            type:String, 
            required:true 
        },
        description:{
            type:String, 
           
        },
        status:{
            type:String, 
            required:true
        }
    }
)

//Task Model
const Task=mongoose.model('Task',taskSchema);

module.exports = Task;