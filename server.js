const AUTHINFO = {
   username:"test",
   password:"test"
};

const express = require('express');
const bodyParser = require('body-parser');
const basicAuth = require('basic-auth-connect');
const cors = require('cors');
require('dotenv').config({ debug:true });

const DiscoveryV2 = require('ibm-watson/discovery/v2');
const { IamAuthenticator } =require('ibm-watson/auth');

var server = express();
server
   .use(bodyParser.json())
   .use(bodyParser.urlencoded({
     extended: false
   }))
   .use(express.static('public'))

   // CORS
   .use(cors())

   // Basic Auth
   .use(basicAuth(
      AUTHINFO.username,
      AUTHINFO.password 
   ))

   .get('/', function (req, res) {
      res.send('watson discovery bridge!')
   })

   .post('/api', async (req, res) => {
      let body = req.body;

      // Check Params
      if (!(body.params)) {
         res.status(500).send({"error": "Invalid projectId!"});
         return;
      }

      if (typeof process.env.API_KEY == 'undefined') {
         console.error('Error: "API_KEY" is not set.');
         console.error('Please consider adding a .env file with API_KEY.');
         process.exit(1);
      }

      const discovery = new DiscoveryV2({
         version: '{version}',
         authenticator: new IamAuthenticator({
            apikey: process.env.API_KEY,
         }),
         version: '2020-08-30',
         serviceUrl: process.env.API_BASE_URL,
      });

      switch (body.api) {
         case "query":
            discovery.query(body.params)
               .then(response => {
                  // console.log(JSON.stringify(response.result, null, 2));
                  res.json(response.result);
               })
               .catch(err => {
                  console.log('error:', err);
                  res.status(500).send({"error": "Failed Watson Discovery query."});
               });
            break;

         case "listProjects":
            discovery.listProjects()
               .then(response => {
                  console.log(JSON.stringify(response.result, null, 2));
                  res.json(response.result);
               })
               .catch(err => {
                  console.log('error:', err);
                  res.status(500).send({"error": "Failed Watson Discovery listProjects."});
               });
            break;

         case "listCollections":
            discovery.listCollections(body.params)
               .then(response => {
                  console.log(JSON.stringify(response.result, null, 2));
                  res.json(response.result);
               })
               .catch(err => {
                  console.log('error:', err);
                  res.status(500).send({"error": "Failed Watson Discovery listCollections."});
               });
            break;

         case "listTrainingQueries":
            discovery.listTrainingQueries(body.params)
               .then(response => {
                  console.log(JSON.stringify(response.result, null, 2));
                  res.json(response.result);
               })
               .catch(err => {
                  console.log('error:', err);
                  res.status(500).send({"error": "Failed Watson Discovery listTrainingQueries."});
               });
            break;

         case "createTrainingQuery":
            discovery.createTrainingQuery(body.params)
               .then(response => {
                  console.log(JSON.stringify(response.result, null, 2));
                  res.json(response.result);
               })
               .catch(err => {
                  console.log('error:', err);
                  res.status(500).send({"error": "Failed Watson Discovery createTrainingQuery."});
               });
            break;

         case "getTrainingQuery":
            discovery.getTrainingQuery(body.params)
               .then(response => {
                  console.log(JSON.stringify(response.result, null, 2));
                  res.json(response.result);
               })
               .catch(err => {
                  console.log('error:', err);
                  res.status(500).send({"error": "Failed Watson Discovery getTrainingQuery."});
               });
            break;

         case "updateTrainingQuery":
            discovery.updateTrainingQuery(body.params)
               .then(response => {
                  console.log(JSON.stringify(response.result, null, 2));
                  res.json(response.result);
               })
               .catch(err => {
                  console.log('error:', err);
                  res.status(500).send({"error": "Failed Watson Discovery updateTrainingQuery."});
               });
            break;

         default:
            break;
      }
   });

const port = process.env.PORT || 8080;
server.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log('Server running on port: %d', port);
//   console.log('process.env: ', process.env);
});

