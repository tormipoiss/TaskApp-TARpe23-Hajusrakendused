import ShareController from "../controllers/ShareController.js";

export default (app) => {
    app.route('/api/v1/shares')
        .post(ShareController.create);

    app.route('/api/v1/shares/:taskId')
        .delete(ShareController.deleteBySharedWithUser);
}