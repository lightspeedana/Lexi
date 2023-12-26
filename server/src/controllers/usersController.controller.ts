import { Request, Response } from 'express';
import { usersService } from '../services/users.service';
import { requestHandler } from '../utils/requestHandler';

class UsersController {
    createUser = requestHandler(
        async (req: Request, res: Response) => {
            const { userInfo, experimentId } = req.body;
            const { user, token } = await usersService.createUser(userInfo, experimentId);

            res.cookie('token', token, {
                httpOnly: true,
                sameSite: 'none',
                secure: true,
                maxAge: 24 * 60 * 60 * 1000,
            });
            res.status(200).send(user);
        },
        (req, res, error) => {
            if (error.code === 11000) {
                res.status(409).json({ message: 'User Already Exists' });
                return;
            }
            res.status(500).json({ message: 'Error creating user' });
        },
    );

    login = requestHandler(
        async (req: Request, res: Response) => {
            const { nickname, userPassword, experimentId } = req.body;
            const { token, user } = await usersService.login(nickname, experimentId, userPassword);

            res.cookie('token', token, {
                httpOnly: true,
                sameSite: 'none',
                secure: true,
                maxAge: 24 * 60 * 60 * 1000,
            });
            res.status(200).send({ token, user });
        },
        (req, res, error) => {
            if (error.code === 401) {
                res.status(error.code).json({ message: error.message });
                return;
            }
            res.status(500).json({ message: 'Error creating user' });
        },
    );

    getActiveUser = requestHandler(async (req: Request, res: Response) => {
        if (!req.cookies || !req.cookies.token) {
            throw Object.assign(new Error('No token provided.'), { status: 401 });
        }

        const { token } = req.cookies;
        const { user, newToken } = await usersService.getActiveUser(token);

        res.cookie('token', newToken, {
            httpOnly: true,
            sameSite: 'none',
            secure: true,
            maxAge: 24 * 60 * 60 * 1000,
        });
        res.status(200).send(user);
    });

    logout = requestHandler(async (req: Request, res: Response) => {
        res.clearCookie('token', { httpOnly: true, sameSite: 'none', secure: true });
        res.status(200).send({ message: 'Logged out successfully' });
    });

    checkUserNotExist = requestHandler(
        async (req, res) => {
            const nickname = req.query.nickname as string;
            const experimentId = req.query.experimentId as string;
            const user = await usersService.getUserByName(nickname, experimentId);
            if (user) {
                const error = new Error('User Already Exist');
                error['code'] = 409;
                throw error;
            }

            res.status(200).send('Valid Name');
        },
        (req, res, error) => {
            if (error.code === 409) {
                res.status(409).json({ message: 'User Already Exists' });
            }
        },
    );
}

export const usersController = new UsersController();
