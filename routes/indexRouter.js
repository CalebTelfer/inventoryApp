const { Router } = require('express');
const indexRouter = Router();
const { getAllGames, insertGame, deleteGame, updateGame } = require("../database/queries");

indexRouter.get('/', async (req, res) => {
    const rawGames = await getAllGames();
    const games = rawGames.map(game => {
        game.displayPrice = game.price_cents == 0 ? "FREE" : "$" + (game.price_cents/100).toFixed(2);
        return game;
    })
    res.render('index', {games});
})

indexRouter.get('/admin', async (req, res) => {
    const rawGames = await getAllGames();
    const games = rawGames.map(game => {
        game.displayPrice = game.price_cents == 0 ? "FREE" : "$" + (game.price_cents/100).toFixed(2);
        return game;
    })
    res.render('admin', {games});
})


indexRouter.post('/newgame', async (req,res) => {
    const url = req.body.steamurl;
    const appID = url.match(/\/app\/(\d+)/)[1];

    const response = await fetch(`https://store.steampowered.com/api/appdetails/?appids=${appID}`);
    const data = await response.json();

    const gameObj = data[appID].data;

    const gameData = {
        name: gameObj.name,
        priceInCents: gameObj.is_free ? 0 : gameObj.price_overview.initial,
        genres: gameObj.genres.map(genre => genre.description),
        img: gameObj.header_image,
        description: gameObj.short_description
    }

    await insertGame(gameData);
    res.redirect('/');
})

indexRouter.post('/deletegame', async (req,res) => {
    const gameName = req.body.delgame;
    await deleteGame(gameName);
    res.redirect('/');
});

indexRouter.post('/updateprice', async (req,res) => {
    const gameName = req.body.updatename;
    const price = req.body.newprice; //here would be a good idea to sanitize or validate input later
    await updateGame(gameName, price);
    res.redirect('/');
});

indexRouter.delete('/admin/delete/:id', async (req,res) => {
    const id = req.params.id;
    await deleteGame(id);
    res.send(200);
})


module.exports = indexRouter;