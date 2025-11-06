export default (sequelize, DataTypes) => {
    return sequelize.define(
        "User",
        {
            username: {
                type: DataTypes.STRING,
                primaryKey: true
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false
            }
        }
    );
}