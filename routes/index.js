/* eslint-disable */
import express from 'express';
import AppController from '../controllers/AppController.js';
import UserController from '../controller'

const router = express.Router();

router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);
router.post('/users', UsersController.postNew);

export default router;