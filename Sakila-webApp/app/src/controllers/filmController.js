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
        filmService.getFilmDetails(id, function (err, film) {
        if (err) return next(err);
        if (!film) return res.status(404).render('layout', { title: 'Not Found',
            body: '<div class="container py-5"><h1>Film not found</h1></div>' });
            res.render('films/detail', { title: film.title, film: film });
    });
}
module.exports = { list, detail };
