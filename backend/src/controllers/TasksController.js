import { taskService } from "../data/services/taskServices.js";

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
        if (!req.body.title || !req.body.description || !req.body.username) {
            return res.status(400).send({ error: "Missing required fields: title / description / username" });
        }
    } catch (error) {
        return res.status(400).send({ error: "Missing required fields: title / description / username" });
    }
    const deadline = Date.parse(req.body.deadline);
    if (req.body.deadline && isNaN(deadline)) {
        return res.status(400).send({ error: "Empty or malformed date string in field: deadline" });
    }
    const task = await taskService.createTask(req.body.username, req.body.title, req.body.description, deadline);
    return res.status(201).json(task)
}

const updateById = async (req, res) => {
    if (!req.params.id) {
        return res.status(400).send({ error: "URL does not contain ID" });
    }
    try {
        if (!req.body.title || !req.body.description || !req.body.username) {
            return res.status(400).send({ error: "Missing required fields: title / description / username" });
        }
    } catch (error) {
        return res.status(400).send({ error: "Missing required fields: title / description / username" });
    }
    const deadline = Date.parse(req.body.deadline);
    if (req.body.deadline && isNaN(deadline)) {
        return res.status(400).send({ error: "Empty or malformed date string in field: deadline" });
    }
    const task = await taskService.updateTask(req.params.id, req.body.username, req.body.title, req.body.description, deadline);
    if (!task) {
        return res.status(404).send({ error: "Task not found" });
    }
    return res.json(task)
}

const deleteById = async (req,res)=>{
    if(!req.params.id){
        return res.status(400).send({error:"URL does not contain ID"})
    }
    const success = await taskService.deleteTask(req.params.id);
    if(!success){
        return res.status(404).send({error:"Task not found"})
    }
    return res.status(204).send()
}

export default { getAll, getById, create, updateById, deleteById }