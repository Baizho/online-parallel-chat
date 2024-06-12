import { Router } from 'express';
import authRouter from './auth/auth-router';
import messageRouter from './events/message-router';
// other routers can be imported here

const globalRouter = Router();


globalRouter.use(authRouter);
globalRouter.use(messageRouter);


// other routers can be added here

export default globalRouter;
