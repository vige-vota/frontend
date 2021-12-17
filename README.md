# frontend
the react application to vote and manage the voting paper

Go in the frontend folder and run npm through the following commands:
```
npm install
npm start
```

And connect to [http://localhost:3000](http://localhost:3000)

You would update the online application in [http://vota-frontend.vige.it](http://vota-frontend.vige.it) url. Simply digit in your frontend folder the command:
```
npm run deploy
```

If you need a production environment go in the frontend folder and run npm through the following commands:
```
npm install
npm ci --only=production
npm run build
```
Then create a SSL certificate for the https. Here a sample:
```
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout server.key -out server.crt -subj "/C=GB/ST=London/L=London/O=Global Security/OU=IT Department/CN=localhost"
```
and copy it in the home directory under the .https-serve folder.

Now to start the application install the https server:
```
sudo npm install -g https-serve
```
Then go in the build folder and start with the command:
```
https-serve -s build
```

Add the following DNS in your /etc/hosts file:
```
$IP_ADDRESS  vota-votingpapers.vige.it
$IP_ADDRESS  vota-voting.vige.it
```

where in $IP_ADDRESS you must choose the ip address where is located the server

Now you can connect in the application going to: open [https://localhost](https://localhost)

## Eclipse

To make the project as an Eclipse project go in the root folder of the project and run the following commands:
```
sudo npm install -g nodeclipse
nodeclipse -p
```

## Online application

You can see the updated online application simply connecting to:
Then open [http://vota-frontend.vige.it](http://vota-frontend.vige.it)
