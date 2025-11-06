export default async (db) => {
    await db.Tasks.findOrCreate({
        where: { username: "Tiit" },
        defaults: { 
            username: "Tiit",
            title:"asdas",
            description:"asdsadasasdasdas",
            deadline: new Date("2025-11-18T00:00:00.000Z"),
        },
    });
}