const API_KEY = "8c8e1a50-6322-4135-8875-5d40a5420d86";
const API_URL_POPULAR = "https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_250_BEST_FILMS&page=1";
const API_URL_SEARCH = 'https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=';
const API_URL_MOVIE_DATEILS = 'https://kinopoiskapiunofficial.tech/api/v2.2/films/'

document.addEventListener('DOMContentLoaded', function () {
    getMovies(API_URL_POPULAR);
})

function getMovies(url) {
    fetch(url, {
        headers: {
            "Content-Type": "application/json",
            "X-API-KEY": API_KEY,
        },
    }).then(response => response.json()).then(function (response) {
        showMovies(response)
    });


}

function getClassByRate(vote) {
    if (vote >= 7) {
        return "green"
    } else if (vote > 5) {
        return "orange";
    } else {
        return "red";
    }
}

function showMovies(data) {
    const moviesEl = document.querySelector(".movies");

    document.querySelector(".movies").innerHTML = "";

    data.films.forEach((movie) => {
        const movieEl = document.createElement("div");
        movieEl.classList.add("movie");
        movieEl.innerHTML = `
<div class="movie__cover-inner">
<img src="${movie.posterUrlPreview}" alt="${movie.nameRu}" class="movie__cover">
<div class="movie__cover--darkened"></div>
</div>
<div class="movie__info">
<div class="movie__title">${movie.nameRu}</div>
<div class="movie__category">${movie.genres.map((genre) => `${genre.genre}`)}</div>
${movie.rating && (`
<div class="movie__average movie__average--${getClassByRate(movie.rating)}">${movie.rating}</div>
`)}
</div>
`;
        movieEl.addEventListener("click", () => openModal(movie.filmId))
        moviesEl.appendChild(movieEl);
    });
}

const form = document.querySelector('form');
const search = document.querySelector('.header__search');

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const apiSearchUrl = `${API_URL_SEARCH}${search.value}`
    if (search.value) {
        getMovies(apiSearchUrl)

        search.value = "";
    }
})

//---------------modal-----------------

const modalEl = document.querySelector(".modal");

async function openModal(id) {
    const resp = await fetch(API_URL_MOVIE_DATEILS + id, {
        headers: {
            "Content-Type": "application/json",
            "X-API-KEY": API_KEY,
        },
    });
    const respData = await resp.json();

    modalEl.classList.add("modal--show");

    modalEl.innerHTML = `
<div class="modal__card">
    <div class="modal__card-animation">
        <img src='${respData.posterUrl}' alt="" class="modal__movie-backdrop">
        <h2>
            <span class="modal__movie-title">Название - ${respData.nameRu}</span>
            <span class="modal__release-year">Год - ${respData.year}</span>
        </h2>
        <ul class="modal__movie-info">
            <div class="loader"></div>
            <li class="modal__movie-genre">Жанр - ${respData.genres.map((genre) => `${genre.genre}`)}</li>
            ${respData.filmLength ? `<li class="modal__movie-runtime">Время - ${respData.filmLength} минут</li>` : ''}
            <li>Сайт: <a target="_blank" class="modal__movie-site" href="${respData.webUrl}"> ${respData.webUrl}</a></li>
            <li class="modal__movie-overview">Описание - ${respData.shortDescription}</li>
        </ul>
        <button class="modal__button-close">Закрыть</button>
        </div>
</div>
`
    const btnClose = document.querySelector('.modal__button-close');
    btnClose.addEventListener('click', () => closeModal())
}

function closeModal() {
    modalEl.classList.remove("modal--show");
}

window.addEventListener('click', (e) => {
    if (e.target === modalEl) {
        closeModal()
    }
})

window.addEventListener("keydown", (e) => {
    if (e.keyCode === 27) {
        modalEl.classList.remove("modal--show");
    }
})