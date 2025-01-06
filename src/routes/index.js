import meetRouter from "./meet.js";

const API_VERSION_PREFIX = '/api'

export const  setupRoutes = (app)=> {
  app.use(`${API_VERSION_PREFIX}/meet`, meetRouter);
}

