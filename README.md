# frontend
the react application to vote and manage the voting paper

Go in the frontend folder and run npm through the following commands:
```
npm install
npm run build
npm ci --only=production
```
Then create a SSL certificate for the https. Here a sample:
```
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout server.key -out server.crt -subj "/C=GB/ST=London/L=London/O=Global Security/OU=IT Department/CN=Vige"
```
and copy it in the home directory under the .http-serve folder.

Now to start the application install the https server:
```
sudo npm install -g https-serve
```
Then go in the build folder and start with the command:
```
https-serve -s build
```
Now you can connect in the application going to: open `https://localhost`

#Eclipse

To make the project as an Eclipse project go in the root folder of the project and run the following commands:
```
npm install nodeclipse
nodeclipse -p
```

## Docker

If you need a complete environment you can download docker and import the application through the command:
```
docker pull vige/vota
```
To run the image use the command:
```
docker run -d --name vota -p443:8443 vige/vota
```
Then open `https://localhost` to connect to the vote application

## Docker

If you need a complete environment you can download docker and import the application through the command:
```
docker pull vige/vota
```
To run the image use the command:
```
docker run -d --name vota -p443:443 vige/vota:demo
```

Then open `https://localhost` to connect to the vote application
