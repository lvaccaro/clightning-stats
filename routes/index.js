var express = require('express');
var router = express.Router();
const LightningClient = require('lightning-client');
const client = new LightningClient(process.env.LIGHTNINGDIR || '~/.lightning', true);

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

router.get('/listconfigs', function(req, res, next) {
    client.listconfigs()
        .then(configs => {res.status(200).send(configs);})
.catch(err => {res.status(500);});
});

router.get('/dev-listaddrs', function(req, res, next) {
    client.devListaddrs()
        .then(object => {
            const wrapAddresses = {
                addresses: object.addresses.map (function (address){
                    // avoid exposing pubkey, p2sh_redeemscript and bech32_redeemscript
                    return {
                        keyidx: address.keyidx,
                        p2sh: address.p2sh,
                        bech32: address.bech32
                    };
                })
            };
            res.status(200).send(wrapAddresses);
        })
        .catch(err => {res.status(500);});
});

module.exports = router;
