import express from 'express';
import cors from 'cors';
import usersRoutes from './routes/users.routes.js';
import chefApplicationsRoutes from './routes/chefApplications.routes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/users', usersRoutes);
app.use('/chef-applications', chefApplicationsRoutes);

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'HomeBite API is running'
  });
});

export default app;
