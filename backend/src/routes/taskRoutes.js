import TasksController from "../controllers/TasksController.js";

export default (app) => {
    app.route('/api/v1/tasks')
        .post(TasksController.create);

    app.route('/api/v1/tasks/:id')
        .get(TasksController.getById)
        .put(TasksController.updateById)
        .delete(TasksController.deleteById);

    app.route('/api/v1/tasks/getbyuser/:username')
        .get(TasksController.getAll)
}