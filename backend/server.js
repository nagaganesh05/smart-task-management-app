
require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const models = require('./models'); 
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const adminRoutes = require('./routes/adminRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();


app.use(cors()); 
app.use(express.json()); 


app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/admin', adminRoutes);


app.use(errorHandler);

const PORT = process.env.PORT || 5000;


models.sequelize.sync()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log('Database synced successfully.');
        });
    })
    .catch(err => {
        console.error('Failed to sync database:', err.message);
        process.exit(1); 
    });