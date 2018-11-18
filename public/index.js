'use strict';
/* global document */
/* global XMLHttpRequest */
/* global window */

// Configs
if (!window.location.origin) {
	// https://tosbourn.com/a-fix-for-window-location-origin-in-internet-explorer/
	window.location.origin = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
}

const url = window.location.origin;

// Init calls
printUrl(url);
listconfigs(printConfigs);
getinfo(printInfo);

listpeers(peers => {
	const aliasMap = {};
	const channels = [];
	let counter = peers.length;

	peers.forEach(p => {
		if (p.channels) {
			p.channels.forEach(c => {
				c.id = p.id;
				channels.push(c);
			});
		}
		listnode(p.id, node => {
			--counter;
			p.alias = node.alias;
			aliasMap[node.nodeid] = p.alias;
			if (counter === 0) {
				channels.forEach(c => {
					c.alias = aliasMap[c.id];
				});
				printChannels(channels);
				printPeers(peers);
			}
		});
	});
});

devListAddrs(printDevListAddrs);

// Functions
function simpleAyaxRequest(api, completion) {
	const xhttp = new XMLHttpRequest();
	xhttp.open('GET', url + '/' + api, true);
	xhttp.onreadystatechange = function () {
		if (this.readyState === this.DONE) {
			completion(JSON.parse(xhttp.responseText));
		}
	};
	xhttp.addEventListener('error', () => {
		console.error(xhttp.statusText);
	});
	xhttp.send();
}

function listconfigs(callback) {
	simpleAyaxRequest('listconfigs', callback);
}

function getinfo(callback) {
	simpleAyaxRequest('getinfo', callback);
}

function simpleAyaxRequestUnwrap(api, unwrapper, callback) {
	simpleAyaxRequest(api, wrapper => {
		const result = unwrapper(wrapper);
		callback(result);
	});
}

function fieldUnwrapper(field) {
	return function (wrapper) {
		return wrapper[field];
	};
}

function listnode(id, callback) {
	simpleAyaxRequestUnwrap('listnodes/' + id, nodeWrapper => {
		return fieldUnwrapper('nodes')(nodeWrapper)[0];
	}, callback);
}

function listnodes(callback) { // eslint-disable-line no-unused-vars
	simpleAyaxRequestUnwrap('listnodes', fieldUnwrapper('nodes'), callback);
}

function listpeers(callback) {
	simpleAyaxRequestUnwrap('listpeers', fieldUnwrapper('peers'), callback);
}

function devListAddrs(callback) {
	simpleAyaxRequestUnwrap('dev-listaddrs', fieldUnwrapper('addresses'), callback);
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

	if (info.address) {
		info.address.forEach(addressInfo => {
			addressInfo.URI = info.id + '@' + addressInfo.address + ':' + addressInfo.port;
		});
	} else {
		info.address = [];
	}

	tag.innerHTML = '\tnodeid: ' + info.id + '\n' +
        '\taddress:\n' + info.address.map(addr => {
                return '\t\ttype: ' + addr.type + '\n' + // eslint-disable-line indent
                       '\t\taddress: ' + addr.address + '\n' +
                       '\t\tport: ' + addr.port + '\n' +
                       '\t\tURI: ' + addr.URI;
        }).join('\n\n') + '\n\n' +
        '\tversion: ' + info.version + '\n' +
        '\tblockheight: ' + info.blockheight + '\n' +
        '\tnetwork: ' + info.network + '\n';
}

function printInfoStringify(info) { // eslint-disable-line no-unused-vars
	const tag = document.getElementById('info');
	if (info.address) {
		info.address.forEach(addressInfo => {
			addressInfo.URI = info.id + '@' + addressInfo.address + ':' + addressInfo.port;
		});
	}
	tag.innerHTML = JSON.stringify(info, null, 8);
}

function printPeers(peers) {
	const tag = document.getElementById('peers');
	tag.innerHTML = '';
	peers.forEach(p => {
		tag.innerHTML += '\tnodeid: ' + p.id + '\n' +
            ((p.alias) ? ('\talias: ' + p.alias + '\n') : '') +
            '\tconnected: ' + p.connected + '\n' +
            '\tstate: ' + ((p.state) ? p.state : 'NORMAL') + '\n' +
            '\tchannels: ' + ((p.channels) ? p.channels.length : 0) + '\n' +
            '\tURI:\n' + p.netaddr.map(addr => {return '\t\t' + p.id + '@' + addr;}).join('\n') + '\n\n'; // eslint-disable-line brace-style
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
            '\tstatus:\n' + c.status.map(status => {return '\t\t' + status;}).join('\n') + '\n\n'; // eslint-disable-line brace-style
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
