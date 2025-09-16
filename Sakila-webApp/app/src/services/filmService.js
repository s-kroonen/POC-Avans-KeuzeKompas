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
    filmRepo.findById(id, function (err, film) {
        if (err) return cb(err);
        cb(null, film); // film will be null if not found
    });
}
function getLanguages(cb) {
    filmRepo.findAllLanguages(cb);
}

function createFilm(data, cb) {
    // Basic validation
    if (!data.title) return cb({ message: 'Title is required' });
    if (data.rental_duration < 0 || data.rental_rate < 0 || data.length < 0 || data.replacement_cost < 0) {
        return cb({ message: 'Values cannot be negative' });
    }
    filmRepo.create(data, cb);
}

function updateFilm(data, cb) {
    if (!data.id) return cb({ message: 'Film ID required' });
    if (!data.title) return cb({ message: 'Title is required' });
    if (data.rental_duration < 0 || data.rental_rate < 0 || data.length < 0 || data.replacement_cost < 0) {
        return cb({ message: 'Values cannot be negative' });
    }
    filmRepo.update(data, cb);
}

function deleteFilm(id, cb) {
    filmRepo.delete(id, cb);
}


module.exports = { getPagedFilms, getFilmDetails , getLanguages, createFilm, updateFilm, deleteFilm};
