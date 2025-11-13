import { shareService } from "../data/services/shareServices.js";
import { taskService } from "../data/services/taskServices.js";
import { userService} from "../data/services/userServices.js";

const getAll = async (req, res) => {
    const tasks = await taskService.getAllTasks("Tiit");
    res.status(200).type('text/plain').send(tasks);
}

const getById = async (req, res) => {
    if (!req.params.id) {
        return res.status(400).send({ error: "URL does not contain ID" });
    }
    const task = await taskService.getTask(req.params.id);
    if (!task) {
        return res.status(404).send({ error: "Task not found" });
    }
    return res.json(task);
}

const create = async (req, res) => {
    try {
        if (!req.body.taskOwner || !req.body.taskId || !req.body.sharedWith) {
            return res.status(400).send({ error: "Missing required fields: taskOwner / taskId / sharedWith" });
        }
    } catch (error) {
        return res.status(400).send({ error: "Missing required fields: taskOwner / taskId / sharedWith" });
    }
    const task = await taskService.getTask(req.body.taskId);
    if (!task) {
        return res.status(404).send({ error: "Task not found" });
    }
    const owner = await userService.getUser(req.body.taskOwner);
    if (!owner) {
        return res.status(404).send({ error: "Task owner not found" });
    }
    const sharedWith = await userService.getUser(req.body.sharedWith);
    if (!sharedWith) {
        return res.status(404).send({ error: "User who this was shared to not found" });
    }
    const alreadyShared = await shareService.getShareFromTask(req.body.taskId,req.body.sharedWith);
    if(alreadyShared){
        return res.status(409).send({ error: "Task already shared with this user" });
    }
    const share = await shareService.createShareTask(req.body.taskId,req.body.taskOwner,req.body.sharedWith);
    return res.status(201).json(share)
}

const deleteBySharedWithUser = async (req,res)=>{
    if(!req.params.taskId){
        return res.status(400).send({error:"URL does not contain task ID"})
    }
    try {
        if (!req.body.sharedWith) {
            return res.status(400).send({ error: "Missing required fields: sharedWith" });
        }
    } catch (error) {
        return res.status(400).send({ error: "Missing required fields: sharedWith" });
    }
    const sharedWith = await userService.getUser(req.body.sharedWith);
    if (!sharedWith) {
        return res.status(404).send({ error: "User who this was shared to not found" });
    }
    const success = await shareService.deleteShareFromTask(req.params.taskId,req.body.sharedWith);
    if(!success){
        return res.status(404).send({error:"Share not found"})
    }
    return res.status(204).send()
}

export default { deleteBySharedWithUser, create,}