import express from 'express';
import admin from './admin.js';
import site from './site.js';
import user from './user.js';
const router = express.Router();
router.use(admin);
router.use(user);
router.use(site);

export default router;
