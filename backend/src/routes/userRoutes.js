import UsersController from "../controllers/UsersController.js";

export default (app) => {
    app.route('/api/v1/users/:username')
        .get(UsersController.getById)
        .delete(UsersController.deleteById);

    app.route('/api/v1/users')
        .post(UsersController.create)
        .get(UsersController.getAllUsers);

    app.put('/api/v1/users/:username/password', UsersController.updatePassword);
    app.post('/api/v1/users/login', UsersController.get);
}