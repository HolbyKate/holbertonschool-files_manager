/* eslint-disable */

import sha1 from 'sha1';
import dbClient from '../utils/db.mjs';
import redisClient from '../utils/redis.mjs';
import { v4 as uuidv4 } from 'uuid';

class AuthController {
    static async getConnect(_req, res) {
        console.log('Received connect request');

        if (!dbClient.isAlive()) {
            return res.status(500).json({ error: 'Database connection not established' });
        }
        const authHeader = _req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Basic ')) {
            console.log('No auth header or invalid auth header');
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const base64Credentials = authHeader.split(' ')[1];
        const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
        const [email, password] = credentials.split(':');

        const hashedPassword = sha1(password);
        const usersCollection = dbClient.db.collection('users');
        const user = await usersCollection.findOne({ email, password: hashedPassword });

        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const token = uuidv4();
        const key = `auth_${token}`;
        await redisClient.set(key, user._id.toString(), 86400); // 24 hours

        return res.status(200).json({ token });
    }

    static async getDisconnect(req, res) {
        const token = req.headers['x-token'];
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const key = `auth_${token}`;
        const userId = await redisClient.get(key);

        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        await redisClient.del(key);
        return res.status(204).send();
    }
}

export default AuthController;