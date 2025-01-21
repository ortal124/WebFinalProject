import { Request, Response } from 'express';
import { processUserWithImages } from '../utils/download'
import userService from '../services/user_service';

export const getUserProfile = async (req: Request, res: Response) => {
    try {
        const user = await userService.getUser(req.params.id);
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        const userDoc = user.toObject();
        const downloadedUser = await processUserWithImages(userDoc);

        res.json(downloadedUser);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching user profile' });
    }
};

export const updateUserName = async (req: Request, res: Response) => {
    try {
        const { username} = req.body;
        const { userId } = req.params;

        if (!username) {
            res.status(400).json({ error: 'Username is required' });
            return;
        }
        
        const user = await userService.getUser(userId);
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        const updatedUser = await userService.updateUserFields(
          userId,
          { username }
        );     
        res.status(201).json(updatedUser);
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

    const user = await userService.updateUserFields(
        userId,
        { profileImage: imageUrl }
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
