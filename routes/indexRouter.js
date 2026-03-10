const { Router } = require('express');
const indexRouter = Router();
const { getAllGames } = require("../database/queries");

indexRouter.get('/', async (req, res) => {
    const rawGames = await getAllGames();
    const games = rawGames.map(game => {
        game.displayPrice = game.price_cents == 0 ? "FREE" : "$" + (game.price_cents/100).toFixed(2);
        return game;
    })
    res.render('index', {games});
})

module.exports = indexRouter;