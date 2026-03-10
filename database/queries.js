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

async function insertGame() {

}
module.exports = {
  getAllGames,
  insertGame
};
