import { where } from "sequelize";
import { db } from "../dbConfig.js";
const { Tasks, Users } = db;

export const taskService = {
    createTask: async(username, title, description, deadline) => {
        const created = await Tasks.create({ username, title, description, deadline });
        const fresh = await Tasks.findByPk(created.id);
        return fresh.get({ plain: true });
    },
    getAllTasks: async(username)=>{
        const tasks = await Tasks.findAll({where:{username}, attributes: ['id', 'title']})
        return tasks ? tasks: [];
    },
    getTask: async (id) => {
        const task = await Tasks.findOne({
            where: {
                id: id
            },
            include: {
                model: Users,
                as: "Owners"
            }
        });
        return task ? task.get({ plain: true }): undefined;
    },
    updateTask: async(id, username, title, description, deadline) => {
        const [count] = await Tasks.update({ username, title, description, deadline  },
            {
                where: {
                    id
                },
            }
        );
        if (!count) return;
        const freshTask = await Tasks.findByPk(id);
        return freshTask.get({ plain: true });
    },
    deleteTask: async(taskId)=>{
        const deletedCount = await Tasks.destroy({
            where: {
                id: taskId,
            }
        });
        return deletedCount > 0 ? true : false;
    }
}