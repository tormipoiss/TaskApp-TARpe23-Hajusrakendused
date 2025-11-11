export default (sequelize, DataTypes) => {
    return sequelize.define(
        "Share",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            sharedUser: {
                type: DataTypes.STRING,
                allowNull: false,
            }
        }
    );
}