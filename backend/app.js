import express from 'express';
import cors from 'cors';
import usersRoutes from './routes/users.routes.js';
import chefApplicationsRoutes from './routes/chefApplications.routes.js';
import foodsRoutes from './routes/foods.routes.js';
import cartRoutes from './routes/cart.routes.js';
import paymentsRoutes from './routes/payments.routes.js';
import ordersRoutes from './routes/orders.routes.js';
import reviewsRoutes from './routes/reviews.routes.js';
import notificationsRoutes from './routes/notifications.routes.js';
import chatRoutes from './routes/chat.routes.js';
import aiAssistantRoutes from './routes/aiAssistant.routes.js';
import chefProfileRoutes from './routes/chefProfile.routes.js';
import chefSettingsRoutes from './routes/chefSettings.routes.js';
import adminRoutes from './routes/admin.routes.js';
import blogsRoutes from './routes/blogs.routes.js';
import chefsRoutes from './routes/chefs.routes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/users', usersRoutes);
app.use('/chef-applications', chefApplicationsRoutes);
app.use('/foods', foodsRoutes);
app.use('/cart', cartRoutes);
app.use('/', paymentsRoutes);
app.use('/orders', ordersRoutes);
app.use('/reviews', reviewsRoutes);
app.use('/notifications', notificationsRoutes);
app.use('/chat', chatRoutes);
app.use('/ai-assistant', aiAssistantRoutes);
app.use('/chef/profile', chefProfileRoutes);
app.use('/chef', chefSettingsRoutes);
app.use('/admin', adminRoutes);
app.use('/blogs', blogsRoutes);
app.use('/chefs', chefsRoutes);

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'HomeBite API is running'
  });
});

export default app;
