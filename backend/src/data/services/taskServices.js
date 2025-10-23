import Tasks from "../models/TaskModel.js";

export const taskService = {
    createTask: async(username,title,description)=>{
        await Tasks.create({username,title,description})
    },
    getAllTasks: async(username)=>{
        const tasks = await Tasks.findAll({where:{username}, attributes: ['id', 'title']})
        return tasks ? tasks: [];
    },
    getTask: async (id) => {
        const task = await Tasks.findByPk(id, {
            attributes: {exclude: ['createdAt', 'updatedAt']}
        });
        return task ? task.get({ plain: true }): undefined;
    }
}