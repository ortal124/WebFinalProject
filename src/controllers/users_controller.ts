import { Request, Response } from 'express';
import userModel  from '../models/user_model';
import * as dotenv from 'dotenv';
import { processUserWithImages } from '../utils/download'


dotenv.config();

export const getUserProfile = async (req: Request, res: Response) => {
    try {
        const user = await userModel.findById(req.params.id);
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        const downloadedUser = await processUserWithImages(user);

        res.json(downloadedUser);
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

export const addUserPhoto = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({ message: 'No photo uploaded' });
        return;
      }
  
      const { userId } = req.params;
      const imageUrl = `/uploads/${req.file.filename}`;

    const user = await userModel.findByIdAndUpdate(
        userId,
        { profileImage: imageUrl },
        { new: true }
      );
  
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
  
      res.status(200).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error uploading photo' });
    }
  };
export default {
    getUserProfile,
    addUserPhoto,
    updateUserName
};
