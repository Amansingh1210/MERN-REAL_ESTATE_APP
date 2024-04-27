import Listing from "../modals/listing.modal.js";
import { errorHandler } from "../middleware/error.js";

export const createListing = async (req, res ,next) =>{
    try {
        const listing = await Listing.create(req.body);
        return res.status(201).json(listing);
     } catch (error) {
        next(error);
    }
};

export const deleteListing = async (req, res , next)=>{
    const listing = await Listing.findById(req.params.id);
    if(!listing) return next(errorHandler(401,'Listing not found'));

    if(req.user.id !== listing.userRef) return next(errorHandler(401,'You can only delete own listing'));

    try {
        await Listing.findByIdAndDelete(req.params.id);
        return res.status(200).json('listing delete successfully');
    } catch (error) {
        next(error);
    }
}