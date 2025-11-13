import { where } from "sequelize";
import { db } from "../dbConfig.js";
const { Shares } = db;

export const shareService = {
    getShareFromTask: async(taskId,sharedUser) =>{
        const share = await db.Shares.findOne({
            where: {
                TaskId: taskId,
                sharedUser: sharedUser
            }
        });
        return share ? share.get({ plain: true }): undefined;
    },
    createShareTask: async(taskId,owner,sharedUser) => {
        const created = await Shares.create({
            sharedUser: sharedUser,
            TaskId: taskId,
            UserUsername: owner 
        });
        const fresh = await Shares.findByPk(created.id);
        return fresh.get({ plain: true });
    },
    deleteShareFromTask: async(taskId,sharedUser) =>{
        const deletedCount = await Shares.destroy({
            where: {
                TaskId: taskId,
                sharedUser: sharedUser,
            }
        });
        return deletedCount > 0 ? true : false;
    }
}