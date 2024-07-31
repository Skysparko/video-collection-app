import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config';
import User from '../models/User';

export const authenticateJWT = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.sendStatus(401);

  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    (req as any).user = await User.findById(decoded.id);
    next();
  } catch (error) {
    console.log("error", error);
    res.status(403).json({ error: (error as Error).message });
  }
};
