const pool = require("./db");


async function getAllGames() {
  const { rows } = await pool.query(`
    SELECT 
      games.id,
      games.game,
      games.price_cents,
      games.img_url,
      games.description,
      STRING_AGG(genres.genre, ', ') AS genres
    FROM games
    JOIN game_genres ON games.id = game_genres.game_id
    JOIN genres ON genres.id = game_genres.genre_id
    GROUP BY games.id
    ORDER BY games.id
  `);

  return rows;
}

async function insertGame(game) {
  const gameResult = await pool.query(`
    INSERT INTO games (game, price_cents, img_url, description)
    VALUES ($1,$2,$3,$4)
    RETURNING ID
  `,
  [game.name, game.priceInCents, game.img, game.description]
);

const gameId = gameResult.rows[0].id;

  for (const genre of game.genres) {
    await pool.query(`
      INSERT INTO genres (genre)
      VALUES ($1)
      ON CONFLICT (genre) DO NOTHING
    `,
    [genre]
    );

    const genreResult = await pool.query(
      `
      SELECT id FROM genres
      WHERE genre = $1
      `,
      [genre]
    );

    const genreId = genreResult.rows[0].id;

    await pool.query(
      `
      INSERT INTO game_genres (game_id, genre_id)
      VALUES ($1,$2)
      `,
      [gameId, genreId]
    );

  }

}

async function deleteGame(gameID) {

  await pool.query(
    `
    DELETE FROM game_genres WHERE game_id = $1;
    `,
    [gameID]
  )

    await pool.query(
    `
    DELETE FROM games WHERE id = $1;
    `,
    [gameID]
  )
}


async function updateGame(name, price) {
  await pool.query(
    `
    UPDATE games
    SET price_cents = $1
    WHERE game = $2
    `,
    [price, name]
  )
}

async function getGame(id) {
  const { rows } = await pool.query(`
    SELECT 
      games.id,
      games.game,
      games.price_cents,
      games.img_url,
      games.description,
      STRING_AGG(genres.genre, ', ') AS genres
    FROM games
    JOIN game_genres ON games.id = game_genres.game_id
    JOIN genres ON genres.id = game_genres.genre_id
    WHERE games.id = $1
    GROUP BY games.id
    ORDER BY games.id
  `,
  [id]
);

  return rows[0];
}

module.exports = {
  getAllGames,
  insertGame,
  deleteGame,
  updateGame,
  getGame
};
