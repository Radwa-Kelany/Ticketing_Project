import { NextFunction, Request, Response } from 'express';
interface UserPayload {
    email: string;
    id: string;
}
declare global {
    namespace Express {
        interface Request {
            currentUser: UserPayload;
        }
    }
}
export declare const authenticateUser: (req: Request, res: Response, next: NextFunction) => void;
export {};
