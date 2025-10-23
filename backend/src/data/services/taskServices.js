import Tasks from "../models/TaskModel.js";

export const taskService = {
    createTask: async(username,title,description)=>{
        await Tasks.create({username,title,description})
    },
    getAllTasks: async(username)=>{
        const tasks = await Tasks.findAll({where:{username}, attributes: ['id', 'username', 'title', 'description']})
        return tasks ? tasks: [];
    }
}