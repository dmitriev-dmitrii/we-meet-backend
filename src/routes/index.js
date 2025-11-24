import {meetRouter} from "./meet.js";
import {usersRouter} from "./users.js";
import {constants} from "http2";

const API_VERSION_PREFIX = '/api'
export const  setupRoutes = (app)=> {
  app.use(`${API_VERSION_PREFIX}/health`, (req, res) => res.sendStatus(constants.HTTP_STATUS_OK));
  app.use(`${API_VERSION_PREFIX}/meet`, meetRouter);
  app.use(`${API_VERSION_PREFIX}/users`, usersRouter);
}

