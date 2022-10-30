const router = require("express").Router();
const authRoute = require("./user/auth.route");
const usersRoute = require("./user/users.route");
const cityRoute = require("./address/city.route");
const regionRoute = require("./address/region.route");

const routes = [
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/users",
    route: usersRoute,
  },
  {
    path: "/cities",
    route: cityRoute,
  },
  {
    path: "/regions",
    route: regionRoute,
  },
];

routes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
