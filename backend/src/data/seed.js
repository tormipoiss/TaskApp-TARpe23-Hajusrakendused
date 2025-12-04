export default async (db) => {
    const [Tiit, userCreated] = await db.Users.findOrCreate({
        where: { username: "Tiit" },
        defaults: {
            username: "Tiit",
            password: "$2b$10$Xi4FCzwU55BXuOPO3Y14NOJatQxoV.QvMkgKKHM3JZJqAhxIkiDFC"
        }
    });
    console.log("Tiit created", userCreated)
    const [Tormi, tormiCreated] = await db.Users.findOrCreate({
        where: { username: "Tormi" },
        defaults: {
            username: "Tormi",
            password: "$2b$10$Xi4FCzwU55BXuOPO3Y14NOJatQxoV.QvMkgKKHM3JZJqAhxIkiDFC"
        }
    });
    console.log("Tormi created", tormiCreated)
    const [Tormi2, tormiCreated2] = await db.Users.findOrCreate({
        where: { username: "Tormi2" },
        defaults: {
            username: "Tormi2",
            password: "$2b$10$Xi4FCzwU55BXuOPO3Y14NOJatQxoV.QvMkgKKHM3JZJqAhxIkiDFC"
        }
    });
    console.log("Tormi2 created", tormiCreated2)

    const [TiitTask, taskTiitCreated] = await db.Tasks.findOrCreate({
        where: { 
            username: "Tiit", 
            title: "TiitTask" // Include title in the search!
        },
        defaults: { 
            description:"asdsadasasdasdas",
            deadline: new Date("2025-11-18T00:00:00.000Z"),
        }
    });
    console.log("TiitTask created:", taskTiitCreated);

    const [TiitTask2, taskTiitCreated2] = await db.Tasks.findOrCreate({
        where: { 
            username: "Tiit", 
            title: "TiitTask2" // Different title!
        },
        defaults: { 
            description:"asdsadasasdasdas",
            deadline: new Date("2025-11-18T00:00:00.000Z"),
        }
    });
    console.log("TiitTask2 created:", taskTiitCreated2);
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
}