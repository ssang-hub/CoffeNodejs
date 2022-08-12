class exception {
    UserLogged(req, res) {
        res.redirect('/');
    }
}

export default new exception();
