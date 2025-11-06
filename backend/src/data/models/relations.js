export default (db) => {
    db.Tasks.belongsToMany(db.Users, { through: db.Shares, as: "Owners"});
    db.Users.belongsToMany(db.Tasks, { through: db.Shares});
}