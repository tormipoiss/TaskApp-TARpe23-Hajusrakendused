export default async (db) => {
    const [TiitTask, taskTiitCreated] = await db.Tasks.findOrCreate({
        where: { username: "Tiit" },
        defaults: { 
            username: "Tiit",
            title:"TiitTask",
            description:"asdsadasasdasdas",
            deadline: new Date("2025-11-18T00:00:00.000Z"),
        }
    });
    const [TiitTask2, taskTiitCreated2] = await db.Tasks.findOrCreate({
        where: { username: "Tiit" },
        defaults: { 
            username: "Tiit",
            title:"TiitTask2",
            description:"asdsadasasdasdas",
            deadline: new Date("2025-11-18T00:00:00.000Z"),
        }
    });
    console.log("TiitTask -> With Tiit owner created", taskTiitCreated)
    const [TormiTask, taskTormiCreated] = await db.Tasks.findOrCreate({
        where: { username: "Tormi" },
        defaults: { 
            username: "Tormi",
            title:"TormiTask",
            description:"asdsadasasdasdas",
            deadline: new Date("2025-11-18T00:00:00.000Z"),
        }
    });
    console.log("TormiTask -> With Tormi owner created", taskTormiCreated)
    const [Tiit, userCreated] = await db.Users.findOrCreate({
        where: { username: "Tiit" },
        defaults: {
            username: "Tiit",
            password: "$2b$10$XAfZIvRHT6drLqZ7JiGMwOBnbuTMg67BSm.2EJNOA1evILtnWu2i."
        }
    });
    console.log("Tiit created", userCreated)
    const [Tormi, tormiCreated] = await db.Users.findOrCreate({
        where: { username: "Tormi" },
        defaults: {
            username: "Tormi",
            password: "$2b$10$XAfZIvRHT6drLqZ7JiGMwOBnbuTMg67BSm.2EJNOA1evILtnWu2i."
        }
    });
    console.log("Tormi created", tormiCreated)
    const [Tormi2, tormiCreated2] = await db.Users.findOrCreate({
        where: { username: "Tormi2" },
        defaults: {
            username: "Tormi2",
            password: "$2b$10$XAfZIvRHT6drLqZ7JiGMwOBnbuTMg67BSm.2EJNOA1evILtnWu2i."
        }
    });
    console.log("Tormi2 created", tormiCreated2)
    
/*
    const [Share, shareCreated] = await db.Shares.findOrCreate({
        //where: { id: 1 },
        defaults: {
            TaskId: MegaTask.id,
            UserUsername: Tiit.username,
            sharedUser: Tormi.username,
        }
    })
    console.log("Share created", shareCreated);
    console.dir(Share.get({plain:true}), {depth: null});
    */
}