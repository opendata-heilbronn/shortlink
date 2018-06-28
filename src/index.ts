import express from 'express';
import {MongoClient} from 'mongodb';
import {CodeRepository} from "./CodeRepository";
import vhost from "vhost";
import {frontendApp} from "./routes/frontendApp";
import {apiApp} from "./routes/apiApp";

const config = {
    mongo: {
        host: process.env.MONGO_HOST || 'localhost',
        port: process.env.MONGO_PORT || '27017',
        username: process.env.MONGO_USER || 'root',
        password: process.env.MONGO_PASSWORD || 'root',
        database: 'shortlink'
    },
    hosts: {
        api: process.env.FRONTEND_HOST || 'shortapi.cfhn.it',
        frontend: process.env.API_HOST || '/(?:www.)?cfhn\.it/',
    }
};

(async () => {
    const client = await MongoClient.connect(`mongodb://${config.mongo.username}:${config.mongo.password}@${config.mongo.host}:${config.mongo.port}/${config.mongo.database}?authSource=admin`);
    const db = client.db(config.mongo.database);

    const codeRepository = new CodeRepository(db);
    await codeRepository.setupDb();

    const app = express();
    app.locals.codeRepository = codeRepository;

    app.use(vhost(config.hosts.frontend.startsWith('/') ?
        new RegExp(config.hosts.frontend.substring(1, config.hosts.frontend.length - 1)) :
        config.hosts.frontend, frontendApp)
    );

    app.use(vhost(config.hosts.api.startsWith('/') ?
        new RegExp(config.hosts.api.substring(1, config.hosts.api.length - 1)) :
        config.hosts.api, apiApp)
    );

    app.listen(8080, () => console.log('Shortlink started'));
})();


