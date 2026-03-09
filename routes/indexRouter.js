const { Router } = require('express');
const indexRouter = Router();
const { getAllGames } = require("../database/queries");

indexRouter.get('/', async (req, res) => {
    const games = await getAllGames();
    res.render('index', {games});
})

module.exports = indexRouter;