const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const { request } = require("express");

const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: true}));
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/wikiDB', {useNewUrlParser: true, useUnifiedTopology: true});

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    }
});

const Article = mongoose.model("Article", articleSchema);



/********* REQUESTS TARGETING ALL ARTICLES ***********/
app.route("/articles")
.get(function(req, res) {
    Article.find({}, function(err, foundArticles) {
        if (err) {
            res.send(err);
        } else {
            res.send(foundArticles);
        }
    })
})
.post(function(req, res) {
    // console.log(req.body.title);
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });
    newArticle.save(function(err) {
        if (!err) {
            res.send("Successfully added a new article.")
        } else {
            res.send(err);
        }
    });
})
.delete(function(req, res) {
    Article.deleteMany({}, function(err) {
        if (!err) {
            res.send("Successfully deleted all articles.");
        } else {
            res.send(err);
        }
    })
});



/********* REQUESTS TARGETING A SPECIFIC ARTICLE ***********/
app.route("/articles/:articleTitle")
.get(function(req, res) {
        Article.findOne({title: req.params.articleTitle}, function(err, foundArticle) {
            if (foundArticle) {
                res.send(foundArticle);
            } else {
                res.send("No articles matching that title was found.")
            }
        })
})
.put(function(req, res) {
    Article.replaceOne({title: req.params.articleTitle}, {title: req.body.title, content: req.body.content}, function(err) {
        if (!err) {
            res.send("Successfully updated all data in the article.");
        }

    })
})
.patch(function(req, res) {
    Article.updateOne({title: req.params.articleTitle}, req.body, function(err) {
        if (!err) {
            res.send("Successfully updated article.")
        } else {
            res.send(err);
        }
    })
})
.delete(function(req, res) {
    Article.deleteOne({title: req.params.articleTitle}, function(err) {
        if (!err) {
            res.send("Successfully deleted the corresponding article.")
        } else {
            res.send(err)
        }
    })
});





app.listen(3000, function() {
    console.log("Server started on port 3000!");
})
