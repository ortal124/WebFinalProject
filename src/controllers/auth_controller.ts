import { Request, Response } from 'express';
import userModel  from '../models/user_model';
import {IUser} from '../interfaces/IUser';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Document } from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config();

const register = async (req: Request, res: Response) => {
    try {
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await userModel.create({
            email: req.body.email,
            username: req.body.username,
            password: hashedPassword,
        });
        res.status(200).send(user);
    } catch (err) {
        res.status(400).send(err);
    }
};

type tTokens = {
    accessToken: string;
    refreshToken: string;
}

const generateToken = (_id: string): tTokens | null => {
    if (!process.env.TOKEN_SECRET) {
        return null;
    }
    // generate token
    const random = Math.random().toString();
    const accessToken = jwt.sign({
        _id: _id,
        random: random
    },
        process.env.TOKEN_SECRET,
        { expiresIn: process.env.TOKEN_EXPIRES });

    const refreshToken = jwt.sign({
        _id: _id,
        random: random
    },
        process.env.TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRES });
    return {
        accessToken: accessToken,
        refreshToken: refreshToken
    };
};

const login = async (req: Request, res: Response) => {
    try {
        const user = await userModel.findOne({ username: req.body.username });
        if (!user) {
            res.status(400).send('Wrong username or password');
            return;
        }
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            res.status(400).send('Wrong username or password');
            return;
        }
        if (!process.env.TOKEN_SECRET) {
            res.status(500).send('Server Error');
            return;
        }
        // generate token
        const tokens = generateToken(user._id);
        if (!tokens) {
            res.status(500).send('Server Error');
            return;
        }

        user.refreshToken = tokens.refreshToken;
        await user.save();

        res.status(200).send(
            {
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
            });
    } catch (err) {
        res.status(400).send(err);
    }
};

type tUser = Document<unknown, {}, IUser> & IUser & Required<{
    username: string;
}> & {
    __v: number;
}

const verifyRefreshToken = (refreshToken: string | undefined) => {
    return new Promise<tUser>((resolve, reject) => {
        // Get refresh token from body
        if (!refreshToken) {
            reject("fail");
            return;
        }
        // Verify token
        if (!process.env.TOKEN_SECRET) {
            reject("fail");
            return;
        }
        jwt.verify(refreshToken, process.env.TOKEN_SECRET, async (err: any, payload: any) => {
            if (err) {
                reject("fail");
                return;
            }
            // Get the username from token
            const _id = payload._id;
            try {
                // Get the user from the DB
                const user = await userModel.findById(_id);
                if (!user) {
                    reject("fail");
                    return;
                }
                if (user.refreshToken !== refreshToken) {
                    user.refreshToken = '';  // Reset refreshToken
                    await user.save();
                    reject("fail");
                    return;
                }

                resolve(user);
            } catch (err) {
                reject("fail");
                return;
            }
        });
    });
}

const logout = async (req: Request, res: Response) => {
    try {
        const user = await verifyRefreshToken(req.body.refreshToken);
        user.refreshToken = ''; // Clear refresh token upon logout
        await user.save();
        res.status(200).send("Success");
    } catch (err) {
        res.status(400).send("Fail");
    }
};

const refresh = async (req: Request, res: Response) => {
    try {
        const user = await verifyRefreshToken(req.body.refreshToken);
        if (!user) {
            res.status(400).send("Fail");
            return;
        }
        const tokens = generateToken(user._id);

        if (!tokens) {
            res.status(500).send('Server Error');
            return;
        }
        user.refreshToken = tokens.refreshToken; // Save the new refresh token
        await user.save();

        res.status(200).send(
            {
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
                _id: user._id
            });
    } catch (err) {
        res.status(400).send("Fail");
    }
};

export default {
    register,
    login,
    refresh,
    logout,
};
