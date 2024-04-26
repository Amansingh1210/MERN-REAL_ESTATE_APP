import bcryptjs from 'bcryptjs'
import User from '../modals/user.modal.js'
import { errorHandler } from "../middleware/error.js";

export const test = (req,res)=>{
    res.json({
        message: "Hello world",
    });
};

export const updateUser = async (req,res, next)=>{
    if(req.user.id !== req.params.id) return next(errorHandler(401, 'you can only update your own account'));
    try {
        if(req.body.password){
            req.body.password = bcryptjs.hashSync(req.body.password,10)
        }
        const updateUser = await User.findByIdAndUpdate(req.params.id,{
            $set:{
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                avatar: req.body.avatar,
            }
        },{new: true})

        const { password, ...restInfo } = updateUser._doc ;

        res.status(200).json(restInfo);

    } catch (error) {
        next(error)
    }
};

export const deleteUser = async (req,res,next)=>{
    if(req.user.id !== req.params.id) return(errorHandler(401,'you can only delete your own account'));
    try {
        await User.findByIdAndDelete(req.params.id)
        res.clearCookie('access_token')
        res.status(200).json('User has been deleted')
    } catch (error) {
        next(error);
    }
}