import express from "express";
import {Entry} from "../CodeRepository";

export const frontendApp = express.Router();

frontendApp.get('/:code', async (req, res) => {
    const entry: Entry = await res.app.locals.codeRepository.getAndIncrement(req.params.code);
    if(!entry) {
        res.redirect('https://codeforheilbronn.de/');
        return;
    }
    res.redirect(entry.dest);
});

frontendApp.get('/', (req, res) => {
    res.redirect('https://codeforheilbronn.de/');
});
