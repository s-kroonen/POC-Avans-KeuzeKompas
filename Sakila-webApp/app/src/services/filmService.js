const filmRepo = require('../repositories/filmRepository');
function getPagedFilms(page, pageSize, cb) {
    const limit = pageSize;
    const offset = (page - 1) * pageSize;
    filmRepo.count(function (err, total) {
        if (err) return cb(err);
        filmRepo.list(limit, offset, function (err2, rows) {
            if (err2) return cb(err2);
            const totalPages = Math.ceil(total / pageSize);
            cb(null, { rows, page, pageSize, total, totalPages });
        });
    });
}
function getFilmDetails(id, cb) {
    filmRepo.findById(id, function(err, film) {
        if (err) return cb(err);
        cb(null, film); // film will be null if not found
    });
}


module.exports = { getPagedFilms, getFilmDetails };
