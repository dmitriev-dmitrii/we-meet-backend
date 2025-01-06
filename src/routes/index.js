import meetRouter from "./meet.js";
import usersRouter from "./users.js";

const API_VERSION_PREFIX = '/api'

export const  setupRoutes = (app)=> {
  app.use(`${API_VERSION_PREFIX}/meet`, meetRouter);
  app.use(`${API_VERSION_PREFIX}/users`, usersRouter);
}

