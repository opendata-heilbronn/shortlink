import express from "express";
import {Entry} from "../CodeRepository";
import * as bodyParser from "body-parser";
import basicAuth from 'express-basic-auth';
import cors from "cors";

const authMiddleware = basicAuth({
    users: {
        admin: process.env.HTTP_ADMIN || 'correct horse battery staple'
    },
    challenge: true,
    realm: 'CFHN Shortlink API'
});

export const apiApp = express.Router();

apiApp.use(bodyParser.json());
apiApp.use(authMiddleware);
apiApp.use(cors({origin: 'short.cfhn.it'}));

apiApp.get('/:code', async (req, res) => {
    const entry: Entry = await res.app.locals.codeRepository.get(req.params.code);
    if(!entry) {
        res.status(404).json({
            reason: 'Not found'
        });
        return;
    }
    res.json(entry);
});

apiApp.post('/:code', async (req, res) => {
    if("dest" in req.body) {
        const entry = await res.app.locals.codeRepository.saveEntry(req.params.code, req.body.dest);
        if(entry) {
            res.status(201).json(entry).end();
        } else {
            res.status(400).json({success: false}).end();
        }
    }
    res.status(401).end();
});