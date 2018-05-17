'use strict';
/* global document */
/* global XMLHttpRequest */

// Configs
const url = 'http://btctest.waldo.fun:4000'; // Your server url

// Init calls
printUrl(url);
listconfigs();
getinfo();
listpeers();
devListAddrs();

// Functions

function listconfigs() {
	const xhttp = new XMLHttpRequest();
	xhttp.open('GET', url + '/listconfigs', true);
	xhttp.onreadystatechange = function () {
		if (this.readyState === this.DONE) {
			// Console.log(xhttp.responseText);
			const configs = JSON.parse(xhttp.responseText);
			printConfigs(configs);
		}
	};
	xhttp.addEventListener('error', () => {
		console.error(xhttp.statusText);
	});
	xhttp.send();
}

function getinfo() {
	const xhttp = new XMLHttpRequest();
	xhttp.open('GET', url + '/getinfo', true);
	xhttp.onreadystatechange = function () {
		if (this.readyState === this.DONE) {
			// Console.log(xhttp.responseText);
			const info = JSON.parse(xhttp.responseText);
			printInfo(info);
		}
	};
	xhttp.addEventListener('error', () => {
		console.error(xhttp.statusText);
	});
	xhttp.send();
}

function listpeers() {
	const xhttp = new XMLHttpRequest();
	xhttp.open('GET', url + '/listpeers', true);
	xhttp.onreadystatechange = function () {
		if (this.readyState === this.DONE) {
			// Console.log(xhttp.responseText);
			const peers = JSON.parse(xhttp.responseText).peers;
			// PrintPeers(peers);

			const channels = [];
			peers.forEach(p => {
				if (p.channels) {
					p.channels.forEach(c => {
						c.id = p.id;
						channels.push(c);
					});
				}
			});
			// PrintChannels(channels);

			listnodes(nodes => {
				nodes.forEach(n => {
					channels.forEach(c => {
						if (n.nodeid === c.id) {
							c.alias = n.alias;
						}
					});
					peers.forEach(p => {
						if (n.nodeid === p.id) {
							p.alias = n.alias;
						}
					});
				});

				printPeers(peers);
				printChannels(channels);
			});
		}
	};
	xhttp.addEventListener('error', () => {
		console.error(xhttp.statusText);
	});
	xhttp.send();
}

function listnodes(callback) {
	const xhttp = new XMLHttpRequest();
	xhttp.open('GET', url + '/listnodes', true);
	xhttp.onreadystatechange = function () {
		if (this.readyState === this.DONE) {
			// Console.log(xhttp.responseText);
			const nodes = JSON.parse(xhttp.responseText).nodes;
			callback(nodes);
		}
	};
	xhttp.addEventListener('error', () => {
		console.error(xhttp.statusText);
	});
	xhttp.send();
}

function devListAddrs() {
	const xhttp = new XMLHttpRequest();
	xhttp.open('GET', url + '/dev-listaddrs', true);
	xhttp.onreadystatechange = function () {
		if (this.readyState === this.DONE) {
			// Console.log(xhttp.responseText);
			const addresses = JSON.parse(xhttp.responseText).addresses;
            printDevListAddrs(addresses);
		}
	};
	xhttp.addEventListener('error', () => {
		console.error(xhttp.statusText);
	});
	xhttp.send();
}

function printUrl(url) {
	const tag = document.getElementById('url');
	tag.innerHTML = url;
}

function printConfigs(configs) {
	const tag = document.getElementById('configs');
	tag.innerHTML = '\talias: ' + configs.alias + '\n' +
        '\trgb: ' + configs.rgb + '&nbsp;<span style="background-color: #' + configs.rgb + '; border: 1px solid black;">&nbsp;&nbsp;&nbsp;&nbsp;</span>\n' +
        '\tlocktime-blocks: ' + configs['locktime-blocks'] + '\n' +
        '\tcommit-fee: ' + configs['commit-fee'] + '\n' +
        '\tdefault-fee-rate: ' + configs['default-fee-rate'] + '\n' +
        '\tfee-base: ' + configs['fee-base'] + '\n' +
        '\tfee-per-satoshi: ' + configs['fee-per-satoshi'] + '\n';
	document.title = configs.alias;
}

function printInfo(info) {
	const tag = document.getElementById('info');
	tag.innerHTML = '';
	let address;
	if (info.address && info.address.length > 0 && info.address[0].address)		{
		address = info.address[0].address;
	}
	tag.innerHTML = '\tnodeid: ' + info.id + '\n' +
        '\taddress: ' + ((address) ? address : '') + '\n' +
        '\tport: ' + info.port + '\n' +
        '\tversion: ' + info.version + '\n' +
        '\tblockheight: ' + info.blockheight + '\n' +
        '\tnetwork: ' + info.network + '\n';
	if (typeof (address) !== 'undefined') {
		tag.innerHTML += '\tURI: ' + info.id + '@' + address + ':' + info.port + '\n';
	}
}

function printPeers(peers) {
	const tag = document.getElementById('peers');
	tag.innerHTML = '';
	peers.forEach(p => {
		tag.innerHTML += '\tnodeid: ' + p.id + '\n' +
            ((p.alias) ? ('\talias: ' + p.alias + '\n') : '') +
            '\tconnected: ' + p.connected + '\n' +
            '\tstate: ' + ((p.state) ? p.state : 'NORMAL') + '\n' +
            '\tchannels: ' + ((p.channels) ? p.channels.length : 0) + '\n\n';
	});
}

function printChannels(channels) {
	const tag = document.getElementById('channels');
	tag.innerHTML = '';

	let count = 0;
	let	capacityTotal = 0;
	let	capacityUs = 0;
	channels.forEach(c => {
		if (c.state === 'CHANNELD_NORMAL') {
			count++;
			capacityUs += c.msatoshi_to_us;
			capacityTotal += c.msatoshi_total;
		}
	});
	tag.innerHTML += 'Num channels : ' + count + '\n';
	tag.innerHTML += 'Your channel-side capacity : ' + capacityUs + ' msatoshi\n';
	tag.innerHTML += 'Total capacity in channels : ' + capacityTotal + ' msatoshi\n\n';

	channels.forEach(c => {
		tag.innerHTML +=
            '\tchannelid: ' + ((c.short_channel_id) ? c.short_channel_id : '') + '\n' +
            '\tnodeid: ' + c.id + '\n' +
            ((c.alias) ? ('\talias: ' + c.alias + '\n') : '') +
            '\tfunding_txid: ' + c.funding_txid + '\n' +
            '\tstate: ' + c.state + '\n' +
            '\tmsatoshi: ' + c.msatoshi_to_us + '/' + c.msatoshi_total + '\n' +
            '\tto_self_delay: ' + c.to_self_delay + '\n' +
            '\tstatus: ' + JSON.stringify(c.status, null, 8) + '\n\n';
	});
}
function printDevListAddrs(addresses) {
	let html = '<ol><li>';
	html += addresses.map(element => {
		return element.p2sh + ' - ' + element.bech32;
	}).join('</li><li>');
	html += '</li></ol>';
	const tag = document.getElementById('addresses');
	tag.innerHTML = html;
}
