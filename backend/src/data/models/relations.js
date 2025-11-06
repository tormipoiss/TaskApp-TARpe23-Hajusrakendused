export default (db) => {
    db.Tasks.belongsToMany(db.Users, { through: db.Shares});
    db.Users.belongsToMany(db.Tasks, { through: db.Shares});
}