/* eslint-disable */

import sha1 from 'sha1';
import { ObjectId } from 'mongodb';
import dbClient from '../utils/db.mjs';


class UsersController {
    static async postNew(_req, res) {
        const { email, password } = _req.body;

        if (!email) {
            return res.status(400).json({ error: 'Missing email' });
        }

        if (!password) {
            return res.status(400).json({ error: 'Missing password' });
        }

        const usersCollection = dbClient.db.collection('users');
        const existingUser = await usersCollection.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ error: 'Already exist' });
        }

        const hashedPassword = sha1(password);
        const newUser = await usersCollection.insertOne({
            email,
            password: hashedPassword,
        });

        return res.status(201).json({
            id: newUser.insertedId.toString(),
            email,
        });
    }
}

export default UsersController;