import express, { Router, Request, Response } from 'express';
import { CheckSubscriptionController } from './controllers/haircut/CheckSubscriptionController';
import { CountHaircutsController } from './controllers/haircut/CountHaircutsController';
import { CreateHaircutController } from './controllers/haircut/CreateHaircutController';
import { DetailHaircutController } from './controllers/haircut/DetailHaircutController';
import { ListHaircutController } from './controllers/haircut/ListHaircutController';
import { UpdateHaircutController } from './controllers/haircut/UpdateHaircutController';
import { FinishScheduleController } from './controllers/schedule/FinishScheduleController';
import { ListScheduleController } from './controllers/schedule/ListScheduleController';
import { NewScheduleController } from './controllers/schedule/NewScheduleController';
import { CreatePortalController } from './controllers/subscription/CreatePortalController';
import { SubscriptionController } from './controllers/subscription/SubscriptionController';
import { WebHooksController } from './controllers/subscription/WebHooksController';
import { AuthUserController } from './controllers/user/AuthUserController';
import { CreateUserController } from './controllers/user/CreateUserController';
import { DetailUserController } from './controllers/user/DetailUserController';
import { UpdateUserController } from './controllers/user/UpdateUserController';
import { isAuthenticated } from './middlewares/isAuthenticated';

const router = Router();

router.post('/users', new CreateUserController().handle);

router.post('/session', new AuthUserController().handle);

router.get('/me', isAuthenticated, new DetailUserController().handle);

router.put('/update', isAuthenticated, new UpdateUserController().handle);


router.post('/haircut', isAuthenticated, new CreateHaircutController().handle);

router.get('/haircut/list', isAuthenticated, new ListHaircutController().handle);

router.put('/haircut/update', isAuthenticated, new UpdateHaircutController().handle);

router.get('/haircut/check', isAuthenticated, new CheckSubscriptionController().handle);

router.get('/haircut/count', isAuthenticated, new CountHaircutsController().handle);

router.get('/haircut/detail', isAuthenticated, new DetailHaircutController().handle);

router.post('/schedule', isAuthenticated, new NewScheduleController().handle);

router.get('/schedule/list', isAuthenticated, new ListScheduleController().handle);

router.delete('/schedule/finish', isAuthenticated, new FinishScheduleController().handle);

router.post('/subscription', isAuthenticated, new SubscriptionController().handle);

router.post('/webhooks', express.raw({type: 'application/json'}), new WebHooksController().handle);

router.post('/create-portal', isAuthenticated, new CreatePortalController().handle);

export { router };