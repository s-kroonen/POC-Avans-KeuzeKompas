function getHome(req, res) {
    res.render('home/index', { title: 'Sakila – Home' });
}
module.exports = { getHome };
