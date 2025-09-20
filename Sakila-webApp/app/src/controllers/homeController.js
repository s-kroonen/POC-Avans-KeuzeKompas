function getHome(req, res) {
    res.render('home/index', { title: 'Sakila – Home' });
}
function getAbout(req, res) {
    const user = req.session.user;

    res.render('home/about', { title: 'Sakila – About', user });
}
module.exports = { getHome, getAbout };
