const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const wsRoute = require('./ws.route');

const router = express.Router();

router.use('/auth', authRoute);
router.use('/users', userRoute);

// websocket routes [ change `/EMS` to `/ws` in the future ]
router.use('/ws', wsRoute);

module.exports = router;

/**
 * @swagger
 * components:
 *    schemas:
 *      UserTransformed:
 *        type: object
 *        properties:
 *          id:
 *            type: string
 *          username:
 *            type: string
 *          name:
 *            type: string
 *          email:
 *            type: string
 *          phoneNumber:
 *            type: string
 *          role:
 *            type: string
 *    parameters:
 *    securitySchemes:
 *      bearerAuth:
 *        type: http
 *        scheme: bearer
 *        bearerFormat: JWT
 *    requestBodies:
 *    responses:
 *    headers:
 *    examples:
 *    links:
 *    callbacks:
 * security:
 * - bearerAuth: []
 * tags:
 * - name: Authentication
 *   description: login, register, password recovery, etc.
 * - name: User
 *   description: User model CRUD API.
 */
