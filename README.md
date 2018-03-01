# clightning-stats
Web stats of [clightning](https://github.com/ElementsProject/lightning) node #LightningNetworks.

## how to install
Clone the repository then run `npm install` in the cloned directory in order to install dependencies and libraries.

Start the server with the command:
```shell
npm start
```

## how to configure
If you want you can start the server changing the default environment options: 
* `PORT` : server localport (default: 4000)
* `LIGHTNINGDIR` : folder of lightning rpc file (default ~/.lightning)

Plus configure the frontend specific information of your node.

### configure the enviroment 
A simple export of variables make the magic as in the following command:
```shell
PORT=4000 LIGHTNINGDIR=~/.lightning npm start
```
Or if you want start as daemon:
```shell
export PORT=4000
export LIGHTNINGDIR=~/.lightning
nohup npm start &
```

Check the working website opening the url:
```shell
open localhost:4000
```

### configure the frontend
Remember you need to configure the frontend information available in the file `public/index.html`, you will need to change:
* `url` : your server url
* `alias` : your node name
```js

    var url = "http://btctest.waldo.fun:4000"; // your server url
    var alias = "Waldo.fun"; // your node name
```

## automatical startup 
If you want run automatically this information page consider to run it using the PM2 with the `launch.sh` script.

Configure the `launch.sh` script with your custom information and run it using the command `pm2 start launch.sh`.
