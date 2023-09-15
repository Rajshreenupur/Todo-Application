const express = require('express');
const router = express.Router();
const Task = require('../models/task');
const { validationResult } = require('express-validator');
/* REST API Configuration
----------------------
1) Get all the task
	
	URL : http://127.0.0.1:5000/api/tasks 
	REQUEST : GET
	method : router.get()
	fields : no-fields 
	
2) Get a single task
	
	URL : http://127.0.0.1:5000/api/tasks/:id 
	REQUEST : GET
	method : router.get()
	fields : no-fields 	
	
3) Create a task
	
	URL : http://127.0.0.1:5000/api/tasks/ 
	REQUEST : POST
	method : router.post()
	fields : name , image , price , qty , info		
	
	
4) Update a task
	
	URL : http://127.0.0.1:5000/api/tasks/:id
	REQUEST : PUT
	method : router.put()
	fields : name , image , price , qty , info
	
4) Delete a task
	
	URL : http://127.0.0.1:5000/api/tasks/:id
	REQUEST : DELETE
	method : router.delete()
	fields : no-fields		
	 */

// Create a new task
router.post('/tasks', [
  // Validation middleware
  check('title').notEmpty().isString(),
  check('description').isString(),
], async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const task = new Task(req.body);
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get a list of all tasks
router.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.send(tasks);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get a single task by ID
router.get('/tasks/:id', async (req, res) => {
  const taskId = req.params.id;

  try {
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).send({ error: 'Task not found' });
    }
    res.send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update a task by ID
router.patch('/tasks/:id', [
  // Validation middleware
  check('title').optional().isString(),
  check('description').optional().isString(),
  check('completed').optional().isBoolean(),
], async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const taskId = req.params.id;
  const updates = req.body;

  try {
    const task = await Task.findByIdAndUpdate(taskId, updates, {
      new: true,
      runValidators: true,
    });

    if (!task) {
      return res.status(404).send({ error: 'Task not found' });
    }

    res.send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});


// Delete a task by ID
router.delete('/tasks/:id', async (req, res) => {
  const taskId = req.params.id;

  try {
    const task = await Task.findByIdAndDelete(taskId);

    if (!task) {
      return res.status(404).send({ error: 'Task not found' });
    }

    res.send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
