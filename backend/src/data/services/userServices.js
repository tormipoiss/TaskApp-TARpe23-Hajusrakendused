import Users from "../models/UserModel.js";

export const userService = {
    createUser: async (username, hashedPassword) => {
        if (await Users.findByPk(username)) {
            //throw new Error("Username already exists");
            console.log("Username already exists!")
            return;
        }
        await Users.create({ username, password:hashedPassword });
        return { username };
    },
    getUser: async (username) => {
        const user = await Users.findByPk(username);
        return user ? user.get({ plain: true }): undefined;
    }
}