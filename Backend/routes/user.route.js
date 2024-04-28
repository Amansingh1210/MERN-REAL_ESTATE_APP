import express from 'express' ;
import { test, updateUser, deleteUser, getUserListings, getUser } from '../controllers/user.controller.js'
import { verifyUser } from '../middleware/verifyUser.js';

const router = express.Router();

router.get('/test',test);
router.post('/updateuser/:id',verifyUser, updateUser);
router.delete('/delete/:id',verifyUser, deleteUser);
router.get('/listings/:id',verifyUser, getUserListings);
router.get('/:id',verifyUser, getUser);

export default router ;

