var express = require('express');
var router = express.Router();
const LightningClient = require('lightning-client');
const client = new LightningClient(process.env.LIGHTNINGDIR || '/root/.lightning', true);

/* GET home page. */
router.get('/getinfo', function(req, res, next) {
    client.getinfo()
        .then(info => {res.status(200).send(info);})
        .catch(err => {res.status(500);});
});

router.get('/listpeers', function(req, res, next) {
    client.listpeers()
        .then(peers => {res.status(200).send(peers);})
        .catch(err => {res.status(500);});
});

router.get('/listnodes', function(req, res, next) {
    client.listnodes()
        .then(nodes => {res.status(200).send(nodes);})
.catch(err => {res.status(500);});
});

module.exports = router;
