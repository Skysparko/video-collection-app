import { Request, Response } from 'express';
import { loginUser, registerUser } from '../services/auth-service';


export const register = async (req: Request, res: Response) => {
  try {
    const user = await registerUser(req.body.email, req.body.password);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { user, token } = await loginUser(req.body.email, req.body.password);
    res.json({ user, token });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};
