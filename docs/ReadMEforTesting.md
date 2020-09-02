### Running the framework:
Install dependencies.
```sh
$ npm install
```
Install meteor.
[Link to meteor installation](https://www.npmjs.com/package/meteor)
windows meteor installation
```sh
$ choco install meteor 1.8.0.2
$ cd api
$ meteor npm install
```
Test if meteor is running. This should start the meteor server and can be listned on localhost:3001.
```sh
$ cd api
$ meteor run
```
Create meteor-client bundle for angular environment.
```sh
npm run postinstall
```
Start Angular client framework and meteor server.
```sh
$ npm run start
```
Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Testing
Once navigated to the home page. Click on register and register a test account. After submission you should be redirected to login page.If not click on login and log in with the new credentials. 
I would suggest testing the Netsblox/Snap environment in the playground tab. It provides much better testing environment.
Once the Netsblox/Snap environment loads, you would see a template with custom simulation step and start simulation implementation as described in email if I understood it correctly. We are currently using editor database for Netsblox/ Snap related saving or authentication. So please use your editor credentials to login and test the environment. 
### DB connectivity
To connect to the mongoDB databse and check data, the meteor server is running on `http://localhost:3001/`. So, localhost:3001 can be used to connect to mongodb.

### Source code
The framework is divided into three major components.
- Meteor implemetation.
- Angular Implementation.
- Snap/Netsblox client implementation.

The angular implementation can be found in the ./src/app folder. To start the angular framework and run the framework locally.
```sh
$ ng serve
```
The Netsblox/Snap client code implementation can be found in the ./src/assets/SnapClient folder. main.js (for login info, save and load features), actions.js (for logging) and index.dev.html (for server) have been modified.

The meteor implementation can be found in the ../api folder. To access the mongodb database or to start meteor server.
```sh
$ cd api
$ meteor run
```
or
```sh
$ npm run api
```
