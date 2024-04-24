import { errorHandler } from "../middleware/error.js";
import User from "../modals/user.modal.js"
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const signup = async (req,res,next)=>{
    const {username , email , password} = req.body;
    const hashedPassord = bcryptjs.hashSync(password,10)
    const newUser = new User({username ,email ,password:hashedPassord});
    try {
        await newUser.save();
        res.status(201).json('user created successfully !');

    } catch (error) {
        next(error);
    }
}

export const signin = async (req , res , next)=>{
    const {email, password} = req.body;
    try {
        const validUser = await User.findOne({email});
        if(!validUser){
            return next(errorHandler(404,"User Not Found"));
        }
        const validPassword = bcryptjs.compareSync(password,validUser.password);
        if(!validPassword){
            return next(errorHandler(401,"Worng credentials"));
        }
        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
        const {password: pass, ...restInfo} = validUser._doc
        res.cookie('access_token',token,{httpOnly: true}).status(200).json(restInfo);

        await newUser.save();
        res.status(201).json('user login successfully !');
    } catch (error) {
        next(error);
    }
};


export const google = async (req , res ,next)=>{
    try {
        const validUser = await User.findOne({email : req.body.email});
        if(validUser){
            const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
            const { password: pass, ...restInfo } = validUser._doc
            res.cookie('access_token', token, { httpOnly: true }).status(200).json(restInfo);
        } else {
            const generatePassword = Math.random().toString(36).slice(-8);
            const hashedPassord = bcryptjs.hashSync(generatePassword, 10)
            const newUser = new User({ username: req.body.name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4), email: req.body.email, password: hashedPassord, avatar: req.body.profilePhoto });
            await newUser.save();
            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
            const { password: pass, ...restInfo } = newUser._doc
            res.cookie('access_token', token, { httpOnly: true }).status(200).json(restInfo);
        }
    } catch (error) {
        next(error)
    }
}