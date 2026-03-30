const titleInput = document.querySelector("#title");
const previewTitle = document.querySelector("#previewtitle");

const priceInput = document.querySelector("#price");
const previewPrice = document.querySelector("#previewprice");

const genresInput = document.querySelector("#genres");
const previewGenres = document.querySelector("#previewgenres");

const descInput = document.querySelector("#desc");
const previewDesc = document.querySelector("#previewdesc");

titleInput.addEventListener("input", () => {
    previewTitle.textContent = titleInput.value;
})

priceInput.addEventListener("input", () => {
    previewPrice.textContent = "$" + priceInput.value;
})

genresInput.addEventListener("input", () => {
    previewGenres.textContent = genresInput.value;
})

descInput.addEventListener("input", () => {
    previewDesc.textContent = descInput.value;
})