const { Router } = require('express');
const indexRouter = Router();
const { getAllGames, insertGame, deleteGame, updateGame, getGame } = require("../database/queries");

const { body, validationResult } = require("express-validator");


indexRouter.get('/testing', (req,res) => res.render('testing'));

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

indexRouter.delete('/admin/delete/:id', async (req,res) => {
    const id = req.params.id;
    await deleteGame(id);
    res.send(200);
})


indexRouter.get('/admin/edit/:id', async (req,res) => {
    const id = req.params.id;

    const game = await getGame(id);
    game.displayPrice = game.price_cents == 0 ? "FREE" : "$" + (game.price_cents/100).toFixed(2);
    
    res.render('editGame' ,{game});
})

indexRouter.post('/editUpdate',
    [
        body("title")
        .notEmpty()
        .withMessage("Title is required"),

        body("price")
        .optional({ checkFalsy: true })
        .isFloat({ min: 0 })
        .withMessage("Price must be a positive number"),

        body("genres")
        .notEmpty()
        .withMessage("Must Include Genres"),

        body("desc")
        .notEmpty()
        .withMessage("Must Include Description"),

        body("imgurl")
        .isURL()
        .withMessage("Must be a valid URL")
        .matches(/\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i)
        .withMessage("URL must point to an image")
    ],

    async (req,res) => {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array().map(error => error.msg),
        });
        }

        const { title, price, genres, desc, imgurl } = req.body;

        //id, name, price, genres, desc, imgurl
        const gameID = req.query.id;
        const pricecents = Math.round(parseFloat(price) * 100);

        const genreArray = genres
        .split(/[,\s]+/)
        .map(genre => genre.trim())
        .filter(genre => genre !== "");

        await updateGame(gameID, title, pricecents, genreArray, desc, imgurl);
        res.redirect('/');
})

module.exports = indexRouter;