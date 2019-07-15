# frontend
the react application to vote and manage the voting paper

Go in the frontend folder and run npm through the following commands:
```
npm install
npm run build
npm ci --only=production
```
Then create a SSL ceetificate for the https. Here a sample:
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
