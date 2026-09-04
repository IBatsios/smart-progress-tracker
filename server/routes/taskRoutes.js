const express = require('express');
const router = express.Router();
const {
    createTask, getTasks, getTask,
    updateTask, deleteTask, getTodayTasks
} = require('../controllers/taskController');
const protect = require('../middleware/auth');
const { validateTask } = require('../middleware/validation');

// All routes are protected
router.use(protect);

router.route('/')
    .get(getTasks)
    .post(validateTask, createTask);

router.get('/today', getTodayTasks);

router.route('/:id')
    .get(getTask)
    .put(updateTask)
    .delete(deleteTask);

module.exports = router;