import express from 'express' ;
import { createListing, deleteListing, updateListing, getListing, getListings } from '../controllers/listing.controller.js';
import { verifyUser } from '../middleware/verifyUser.js';

const router = express.Router();

router.post('/create',verifyUser , createListing);
router.delete('/delete/:id',verifyUser , deleteListing);
router.post('/update/:id',verifyUser , updateListing);
router.get('/getListing/:id', getListing);
router.get('/get', getListings);


export default router 