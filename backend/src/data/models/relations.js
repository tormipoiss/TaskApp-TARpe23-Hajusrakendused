// export default (db) => {
//     db.Tasks.belongsToMany(db.Users, { 
//         through: db.Shares, 
//         as: "SharedWith",
//         foreignKey: 'TaskId',
//         otherKey: 'sharedUser'
//     });
//     db.Users.belongsToMany(db.Tasks, { through: db.Shares});
// }

export default (db) => {
    // 1. Owner Relation (One-to-Many)
    // A User has many Tasks.
    // Task has a 'username' column that points to User.username (PK)
    db.Users.hasMany(db.Tasks, { 
        foreignKey: 'username', // This is the column in Tasks
        sourceKey: 'username'   // This is the PK in Users
    });

    db.Tasks.belongsTo(db.Users, { 
        foreignKey: 'username', // This is the column in Tasks
        targetKey: 'username'   // This is the PK in Users
    });

    // 2. Sharing Relation (Many-to-Many)
    // Tasks <-> Users (via Shares)

    // A Task belongs to many Users (SharedWith)
    db.Tasks.belongsToMany(db.Users, { 
        through: db.Shares, 
        as: "SharedWith",
        foreignKey: 'TaskId',    // Column in Shares that points to Task (Integer)
        otherKey: 'sharedUser',  // Column in Shares that points to User (String)
        uniqueKey: false         // IMPORTANT: Disable default unique constraints
    });

    // A User belongs to many Tasks (SharedTasks)
    db.Users.belongsToMany(db.Tasks, { 
        through: db.Shares,
        foreignKey: 'sharedUser', // Column in Shares that points to User (String)
        otherKey: 'TaskId',       // Column in Shares that points to Task (Integer)
        uniqueKey: false          // IMPORTANT: Disable default unique constraints
    });
}