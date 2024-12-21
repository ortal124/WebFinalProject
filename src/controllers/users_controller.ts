import { Request, Response } from 'express';
import userModel  from '../models/user_model';
import * as dotenv from 'dotenv';

dotenv.config();

export const getUserProfile = async (req: Request, res: Response) => {
    try {
        const user = await userModel.findById(req.params.id);
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching user profile' });
    }
};

export const updateUserName = async (req: Request, res: Response) => {
    try {
        const { username, userId} = req.body;
        const user = await userModel.findById(userId);
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        const result = await userModel.updateOne(
            { _id: userId },
            { $set: { username } } 
          );        
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching user profile' });
    }
};

export const addUserPhoto = async (req: Request, res: Response) => {
    // TODO
};

export default {
    getUserProfile,
    addUserPhoto,
    updateUserName
};
