'use strict'

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise; //ES6 Promise
require('dotenv').config();
const Schema = mongoose.Schema;

const catSchema = new Schema({
    name:  String,
    age: Number,
    gender: {type: String, enum: ['male', 'female']},
    color: String,
    weight: Number
});


const Cat = mongoose.model('Cat', catSchema);

mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/Cat`).then(() => {
 console.log('Connected successfully.');
 app.listen(process.env.APP_PORT);
 }, err => {
 console.log('Connection to db failed: ' + err);
 });


app.use(express.static('public'));

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.get('/Cat', (req, res) => {
    Cat.find()
        .where('age').gt(10)
        .where('weight').gt(10)
        .exec().then(
        d => {
            console.log(d);
            res.send(d);
        }
    ),err => {
            res.send('Error: ' + err);
        };
});


app.post('/Cat', bodyParser.urlencoded({extended: true}), (req, res) => {
        console.log(req.body);
        Cat.create({
            name: req.body.name,
            age: req.body.age,
            gender: req.body.gender,
            color: req.body.color,
            weight: req.body.weight
        }).then(c => {
            res.send('Cat created: ' + c.id);
        }, err => {
            res.send('Error: '+ err);
        });
    }
);


