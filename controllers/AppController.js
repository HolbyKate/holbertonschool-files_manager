/* eslint-disable */
import redisClient from '../utils/redis.mjs';
import dbClient from '../utils/db.mjs';

class AppController {
    static async getStatus(_req, res) {
        const redisAlive = redisClient.isAlive();
        const dbAlive = dbClient.isAlive();
        res.status(200).json({ redis: redisAlive, db: dbAlive });
    }

    static async getStats(req, res) {
        try {
            const usersCount = await dbClient.nbUsers();
            const filesCount = await dbClient.nbFiles();
            res.status(200).json({ users: usersCount, files: filesCount });
        } catch (error) {
            console.error('Error fetching stats:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

export default AppController;