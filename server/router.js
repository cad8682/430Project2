const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
    app.get('/getEevees', mid.requiresLogin, controllers.Eevee.getEevees);

    app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
    app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);

    app.get('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signupPage);
    app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

    app.get('/logout', mid.requiresLogin, controllers.Account.logout);

    app.get('/maker', mid.requiresLogin, controllers.Eevee.makerPage);
    app.post('/maker', mid.requiresLogin, controllers.Eevee.makeEevee);

    app.put('/evolveEevee/:id', mid.requiresLogin, controllers.Eevee.evolveEevee);

    app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;