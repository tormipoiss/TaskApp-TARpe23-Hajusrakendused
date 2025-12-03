import { userService } from "../data/services/userServices.js";
import dotenv from 'dotenv';
dotenv.config();
import bcrypt from 'bcrypt';
const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS, 10) || 10;

const getById = async (req, res) => {
    if (!req.params.username) {
        return res.status(400).send({ error: "URL does not contain USERNAME" });
    }
    const user = await userService.getUser(req.params.username);
    if (!user) {
        return res.status(404).send({ error: "User not found" });
    }
    return res.json(user);
}
const get = async (req,res)=>{
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send({ error: "Missing username or password" });
    }
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await userService.getUser(username);
    if(!user){
        return res.status(404).send({ error: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).send({ error: "Invalid credentials" });
    }
    return res.status(200).send();
}

const create = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send({ error: "Missing username or password" });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const newUser = await userService.createUser(username, hashedPassword);

    if (!newUser) {
        return res.status(409).send({ error: "Username already exists" });
    }
    return res.status(201).json(newUser);
}

const updatePassword = async (req, res) => {
    const username = req.params.username;
    const { oldPassword, newPassword } = req.body;

    if (!username || !oldPassword || !newPassword) {
        return res.status(400).send({ error: "Missing username, old password, or new password" });
    }
    const user = await userService.getUser(username);
    if (!user) {
        return res.status(404).send({ error: "User not found" });
    }
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
        return res.status(401).send({ error: "Invalid credentials" });
    }
    const newHashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
    const success = await userService.updateUser(username, newHashedPassword);
    if (!success) {
        return res.status(500).send({ error: "Failed to update password" });
    }
    return res.status(201).send();
}

const deleteById = async (req, res) => {
    const username = req.params.username;

    if (!username) {
        return res.status(400).send({ error: "Missing username in URL" });
    }
    const success = await userService.deleteUser(username);
    if (!success) {
        return res.status(404).send({ error: "User not found" });
    }
    return res.status(204).send();
}

const getAllUsers = async (req,res)=>{
    const users = await userService.getAllUsers();
    if(users.count == 0){
        return res.status(404).send({ error: "No users were found" });
    }
    return res.json(users);
}


export default { getById, create, updatePassword, deleteById, get, getAllUsers }