var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.sendFile('/public/html/index.html', {root: __dirname.replace(/routes$/, '') })
});

router.post('/uploadImage', function (req, res, next) {
    try {
        const uploadImageHandler = require('../src/handlers/uploadImage');
        uploadImageHandler(req.body).then(result => {
            res.status(201).send(result);
            res.end();
        }).catch(err => {
            res.status(400).send(err);
            res.end();
        });
    } catch(err) {
        console.error(err.stack);
        res.status(500).send(err);
        res.end();
    }
});

module.exports = router;
