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