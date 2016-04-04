'ust strict';

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Container = require('./Container');
const Subdoc = require('./Subdoc');
const app = express();

mongoose.connect('mongodb://localhost:27017/mongo-ordered-subdocs', function (err) {
  if (err) console.log("DB Error: ", err);
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.json({
    message: 'Welcome to the ordered subdoc app.'
  });
});

// List containers.
app.get('/containers', function (req, res, next) {
  Container.find({}, function (err, containers) {
    if (err) return next(err);

    res.json({
      message: 'Listing all containers',
      containers
    });
  });
});

// Create new container.
app.post('/containers', function (req, res, next) {
  const container = new Container({
    name: req.body.name,
    description: req.body.description,
    isActive: req.body.isActive
  });

  container.save((err) => {
    if (err) return next(err);

    res.json({
      message: 'New container created.',
      container
    });
  });
});

app.put('/containers/:id', function (req, res, next) {
  Container.findById(req.params.id, function (err, container) {
    if (err) return next(err);

    container.name = req.body.name;
    container.description = req.body.description;
    container.isActive = req.body.isActive;

    return container.save((saveErr) => {
      if (saveErr) return next(saveErr);

      res.json({
        message: 'Container updated.',
        container
      });
    });
  });
});

app.delete('/containers/:id', function (req, res, next) {
  Container.findByIdAndRemove(req.params.id, function (err, container) {
    if (err) return next(err);

    res.json({
      message: 'Container removed.',
      container
    });
  });
});

// List subdocs for specific container.
app.get('/containers/:id/subdocs', function (req, res, next) {
  Container.findById(req.params.id, function (err, container) {
    if (err) return next(err);

    res.json({
      message: 'Found container.',
      container,
      subdocs: container.subdocs
    });
  });
});

// Create new subdoc for specific container.
app.post('/containers/:id/subdocs', function (req, res, next) {
  Container.findById(req.params.id, function (err, container) {
    if (err) return next(err);

    const subdoc = new Subdoc({
      name: req.body.name,
      value: req.body.value
    });

    container.subdocs.push(subdoc);

    container.save((saveErr) => {
      if (saveErr) return next(saveErr);

      res.json({
        message: 'New subdoc created.',
        subdoc,
        container
      });
    });
  });
});

// Update subdoc for specific container.
app.put('/containers/:container_id/subdocs/:id', function (req, res, next) {
  const containerId = req.params.container_id;
  const positionChanged = req.body.position >= 0;
  const newPosition = req.body.position;

  Container.findById(req.params.container_id, function (err, container) {
    if (err) return next(err);

    const subdoc = container.subdocs.id(req.params.id);

    if (req.body.name) subdoc.name = req.body.name;
    if (req.body.value) subdoc.value = req.body.value;

    // If position changed, temporarily remove the subdoc from the array.
    if (positionChanged) {
      subdoc.remove();
    }

    return container.save((saveErr) => {
      if (saveErr) return next(saveErr);

      // If the position changed, re-insert the subdoc at the new position.
      if (positionChanged) {
        const query = { _id: conatinerId };
        const doc = {
          $push: {
            subdocs: {
              $each: [subdoc],
              $position: newPosition,
            }
          }
        };

        return Container
          .update(query, doc)
          .exec((updateErr, res) => {
            if (updateErr) return next(updateErr);

            res.json({
              message: 'Subdoc updated.',
              container,
              subdoc
            });
          });
      } else {
        res.json({
          message: 'Subdoc updated.',
          container,
          subdoc
        });
      }
    });
  });
});

// Change position of subdoc for specific container.
app.put('/containers/:container_id/subdocs/:id/position', function (req, res, next) {
  const containerId = req.params.container_id;
  const newPosition = req.body.position;

  Container.findById(containerId, function (err, container) {
    if (err) return next(err);

    // Temporarily remove the subdoc from the array.
    const subdoc = container.subdocs.id(req.params.id).remove();

    return container.save((saveErr) => {
      if (saveErr) return next(saveErr);

      const query = { _id: containerId };
      const doc = {
        $push: {
          subdocs: {
            $each: [subdoc],
            $position: newPosition,
          }
        }
      };

      // Add subdoc back into array at the new position.
      return Container
        .update(query, doc)
        .exec((updateErr, dbRes) => {
          if (updateErr) return next(updateErr);

          res.json({
            message: 'Subdoc updated.',
            container,
            subdoc
          });
        });
    });
  });
});

// Remove subdoc for specific container.
app.delete('/containers/:container_id/subdocs/:id', function (req, res, next) {
  Container.findById(req.params.container_id, function (err, container) {
    if (err) return next(err);

    const subdoc = container.subdocs.id(req.params.id).remove();

    return container.save((saveErr) => {
      if (saveErr) return next(saveErr);

      res.json({
        message: 'Subdoc deleted.',
        container,
        subdoc
      });
    });
  });
});

// Error handling.
app.use(function (err, req, res, next) {
  res.status(500).send({
    message: 'Something went wrong',
    err
  });
});

// Startup the server.
app.listen(3000, function () {
  console.log('Server started at port 3000');
});
