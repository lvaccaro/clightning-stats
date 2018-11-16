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
	const id = req.params.id;
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
			// Allow only non sensitive informations
			const fields = [
				'# version',
				'rgb',
				'alias',
				'ignore-fee-limits',
				'watchtime-blocks',
				'max-locktime-blocks',
				'funding-confirms',
				'commit-fee-min',
				'commit-fee-max',
				'commit-fee',
				'cltv-delta',
				'cltv-final',
				'commit-time',
				'fee-base',
				'rescan',
				'fee-per-satoshi',
				'bind-addr',
				'announce-addr',
				'offline',
				'autolisten',
				'network',
				'allow-deprecated-apis',
				'autocleaninvoice-cycle',
				'autocleaninvoice-expired-by',
				'always-use-proxy',
				'disable-dns'
			];
			const configsRet = {};
			fields.forEach(field => {
				if (configs[field]) {
					configsRet[field] = configs[field];
				}
			});
			res.status(200).send(configsRet);
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
