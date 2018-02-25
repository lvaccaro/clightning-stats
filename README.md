# clightning-stats
Web stats of [clightning](https://github.com/ElementsProject/lightning) node #LightningNetworks.


Start
```shell
npm start
```
Start with environment options: 
* `PORT` : server localport (default: 4000)
* `LIGHTNINGDIR` : folder of lightning rpc file (default ~/.lightning)
```shell
PORT=4000 LIGHTNINGDIR=~/.lightning npm start
```
Start as daemon:
```shell
export PORT=4000
export LIGHTNINGDIR=~/.lightning
nohup npm start &
```
Open url
```shell
open localhost:4000
```

### Frontend
Set info in `public/index.html`:
* `url` : your server url
* `alias` : your node name
```js

    var url = "http://btctest.waldo.fun:4000"; // your server url
    var alias = "Waldo.fun"; // your node name
```