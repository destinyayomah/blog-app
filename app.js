const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');
require('dotenv').config();
const { default: mongoose } = require("mongoose");
const url = process.env.MONGO_URL;
const PORT = process.env.PORT || 3000;

mongoose.set("strictQuery", false);

const pagesSchema = mongoose.Schema({
    name: String,
    content: String
});

const postSchemea = mongoose.Schema({
    title: String,
    body: String
});

const Page = mongoose.model("Page", pagesSchema);
const Post = mongoose.model("Post", postSchemea);

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const posts = [];


app.get('/', (req, res) => {
    const route = _.capitalize('home');

    Page.findOne({ name: route }, (err, page) => {
        Page.find((err, pages) => {
            Post.find((err, posts) => {
                res.render('home', { route: page, posts, pages });
            });
        });
    });
});

app.get('/about', (req, res) => {
    const route = _.capitalize('about');

    Page.findOne({ name: route }, (err, page) => {
        Page.find((err, pages) => {
            res.render('about', { route: page, pages });
        });
    });
});

app.get('/contact', (req, res) => {
    const route = _.capitalize('contact');

    Page.findOne({ name: route }, (err, page) => {
        Page.find((err, pages) => {
            res.render('contact', { route: page, pages });
        });
    });
});

app.get('/compose', (req, res) => {
    Page.find((err, pages) => {
        res.render('compose', { pages });
    });
});

app.get('/posts/:id', (req, res) => {
    const _id = req.params.id;

    Post.findOne({ _id }, (err, post) => {
        Page.find((err, pages) => {
            if (err) { console.log(err); return false; }
            if (post === null) { console.log('post not found'); return false; }

            res.render('post', { post, pages });
        });
    });
});

app.post('/compose', (req, res) => {
    const post = new Post({
        title: req.body.postTitle,
        body: req.body.postBody
    });

    post.save((err, post) => {
        if (err) { console.log(err); return false; }

        console.log('Post created');
        res.redirect('/');
    });
});

mongoose.connect(url, (err) => {
    if (err) { console.log(err); return false; }

    app.listen(PORT, () => {
        console.log("Server connected on port " + PORT);
    });
});