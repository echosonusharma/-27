const path = require('path');
const fs = require('fs');
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');
const Slug = require('./slug');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((res) => console.log('connected to mongodb'))
    .catch((err) => console.log(err));


const app = express();
app.enable('trust proxy');

app.use(helmet());
app.use(morgan('common'));
app.use(express.json());
app.use(express.static('./public'));

const notFoundPath = path.join(__dirname, 'public/404.html');

let readList = new Array;

//read and covert killer.txt to an array
const list = fs.readFileSync('./Killers.txt').toString().split("\n");
list.map((killer) => {
    readList.push(killer.toLocaleLowerCase());
});

//remove duplicates
const people = [...new Set(readList)];

app.get('/:id', async (req, res) => {
    const { id: slug } = req.params;
    try {
        const url = await Slug.findOne({ slug });
        if (url) {
            return res.redirect(url.redirect);
        } else {
            return res.status(404).sendFile(notFoundPath);
        }
    } catch (error) {
        return res.status(404).sendFile(notFoundPath);
    }
});

app.post('/url', slowDown({
    windowMs: 30 * 1000,
    delayAfter: 1,
    delayMs: 5000,
}), rateLimit({
    windowMs: 30 * 1000,
    max: 2,
}), async (req, res, next) => {
    const { url } = req.body;
    const valid = /^(http|https):\/\/[^ "]+$/.test(url);

    let docNumber = new Number;

    await Slug.count({}, function (err, count) {
        try {
            docNumber = count;
        } catch (err) {
            console.log(err);
        }
    });

    try {
        if (valid) {
            if (url.includes('x-27.herokuapp')) {
                return res.json({ msg: 'Stop it. 🛑' });
            };
            if (docNumber <= people.length) {
                let currentSlug = new String;

                await Slug.findOne({}, {}, { sort: { 'created_at': -1 } }, function (err, latestSlug) {
                    try {
                        const i = latestSlug === null ? 0 : people.indexOf(latestSlug.slug) + 1;
                        people.map((person, index) => {
                            index === i && (currentSlug = person);
                        });
                    } catch (err) {
                        console.log(err)
                    }
                });

                const slugUrl = await Slug.create({
                    slug: currentSlug,
                    redirect: url
                });

                await slugUrl.save()
                    .then((result) => {
                        return res.json({
                            url: result.slug
                        });
                    }).catch((err) => {
                        return res.json({
                            msg: process.env.NODE_ENV === 'production' ? '😅 failed to save' : err
                        })
                    });
            } else {
                return res.json({
                    msg: '😢 we ran out of slugs sorry!'
                });
            };
        } else {
            return res.json({
                msg: '😡invalid url'
            });
        }
    } catch (error) {
        next(error);
    };
});

app.use((req, res, next) => {
    res.status(404).sendFile(notFoundPath);
});

app.use((error, req, res, next) => {
    if (error.status) {
        res.status(error.status);
    } else {
        res.status(500);
    }
    res.json({
        message: error.message,
        stack: process.env.NODE_ENV === 'production' ? '💣' : error.stack,
    });
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Sprinting at PORT ${PORT}`);
});