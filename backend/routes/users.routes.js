import express from 'express';
import { getUserByEmail, getUserRoleByEmail, saveFirebaseUser } from '../controllers/users.controller.js';

const router = express.Router();

router.post('/', saveFirebaseUser);
router.get('/role/:email', getUserRoleByEmail);
router.get('/:email', getUserByEmail);

export default router;
