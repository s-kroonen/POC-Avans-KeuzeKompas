const repo = require('../repositories/filmRepository');
function getPagedFilms(page, pageSize, cb) {
    const limit = pageSize;
    const offset = (page - 1) * pageSize;
    repo.countFilms(function (err, total) {
        if (err) return cb(err);
        repo.listFilms(limit, offset, function (err2, rows) {
            if (err2) return cb(err2);
            const totalPages = Math.ceil(total / pageSize);
            cb(null, { rows, page, pageSize, total, totalPages });
        });
    });
}
function getFilmDetails(id, cb) {
    repo.getFilmById(id, cb);
}

module.exports = { getPagedFilms, getFilmDetails };
