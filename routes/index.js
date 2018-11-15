const express = require('express');

const router = express.Router(); // eslint-disable-line new-cap
const LightningClient = require('lightning-client');

const client = new LightningClient(process.env.LIGHTNINGDIR || process.env.HOME + '/.lightning', true);

/* GET home page. */
router.get('/getinfo', (req, res, /* next */) => {
	client.getinfo()
		.then(info => {
			res.status(200).send(info);
		})
		.catch(err => {
			console.log({err});
			res.status(500);
		});
});

router.get('/listpeers', (req, res, /* next */) => {
	client.listpeers()
		.then(peers => {
			res.status(200).send(peers);
		})
		.catch(err => {
			console.log({err});
			res.status(500);
		});
});

router.get('/listnodes/:id', (req, res, /* next */) => {
	const id = req.params['id']
	client.listnodes(id)
		.then(nodes => {
			res.status(200).send(nodes);
		})
		.catch(err => {
			console.log({err});
			res.status(500);
		});
});

router.get('/listconfigs', (req, res, /* next */) => {
	client.listconfigs()
		.then(configs => {
			res.status(200).send(configs);
		})
		.catch(err => {
			console.log({err});
			res.status(500);
		});
});

router.get('/dev-listaddrs', (req, res, /* next */) => {
	client.devListaddrs()
		.then(object => {
			const wrapAddresses = {
				addresses: object.addresses.map(address => {
					// Avoid exposing pubkey, p2sh_redeemscript and bech32_redeemscript
					return {
						keyidx: address.keyidx,
						p2sh: address.p2sh,
						bech32: address.bech32
					};
				})
			};
			res.status(200).send(wrapAddresses);
		})
		.catch(err => {
			console.log({err});
			res.status(500);
		});
});

module.exports = router;
