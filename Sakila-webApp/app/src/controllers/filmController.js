const filmService = require('../services/filmService');
function list(req, res, next) {
    const page = Math.max(parseInt(req.query.page || '1', 10), 1);
    const pageSize = Math.max(parseInt(req.query.pageSize || '20', 10), 1);;
    filmService.getPagedFilms(page, pageSize, function (err, data) {
        if (err) return next(err);
        res.render('films/list', {
            title: 'Films',
            films: data.rows,
            page: data.page,
            pageSize,
            totalPages: data.totalPages
        });
    });
}
function detail(req, res, next) {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.redirect('/films');
    console.log('Fetching details for film ID:', id);
    filmService.getFilmDetails(id, function (err, film) {
        if (err) return next(err);
        if (!film) return res.status(404).render('layout', {
            title: 'Not Found',
            body: '<div class="container py-5"><h1>Film not found</h1></div>'
        });
        res.render('films/detail', { title: film.title, film: film });
    });
}
function newForm(req, res, next) {
    filmService.getLanguages((err, languages) => {
        if (err) return next(err);
        res.render('films/form', { title: 'Add Film', film: {}, languages, errors: null });
    });
}

function create(req, res, next) {
    filmService.createFilm(req.body, (err, id) => {
        if (err) return next(err);
        res.redirect('/films/' + id);
    });
}

function editForm(req, res, next) {
    const id = parseInt(req.params.id, 10);
    filmService.getFilmDetails(id, (err, film) => {
        if (err) return next(err);
        if (!film) return res.status(404).send('Not found');
        filmService.getLanguages((err2, languages) => {
            if (err2) return next(err2);
            res.render('films/form', { title: 'Edit Film', film, languages, errors: null });
        });
    });
}

function update(req, res, next) {
    const id = parseInt(req.params.id, 10);
    const filmData = { ...req.body, id };
    filmService.updateFilm(filmData, (err) => {
        if (err) return next(err);
        res.redirect('/films/' + id);
    });
}

function remove(req, res, next) {
    const id = parseInt(req.params.id, 10);
    filmService.deleteFilm(id, (err) => {
        if (err) return next(err);
        res.redirect('/films');
    });
}

module.exports = { list, detail, newForm, create, editForm, update, remove };
