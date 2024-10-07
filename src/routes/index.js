import usersRouter from "./users.js";


export const  setupRoutes = (app)=> {
  app.use(`/users`, usersRouter);
}






