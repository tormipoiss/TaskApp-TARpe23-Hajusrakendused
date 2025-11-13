export default (db) => {
    db.Tasks.belongsToMany(db.Users, { 
        through: db.Shares, 
        as: "SharedWith",
        foreignKey: 'TaskId',
        otherKey: 'sharedUser'
    });
    db.Users.belongsToMany(db.Tasks, { through: db.Shares});
}