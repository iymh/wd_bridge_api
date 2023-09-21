const AUTHINFO = {
   username:"test",
   password:"test"
};

const express = require('express');
const bodyParser = require('body-parser');
const basicAuth = require('basic-auth-connect');
const cors = require('cors');
require('dotenv').config({ debug:true });

// File upload function
const fs = require('fs');
const multer = require('multer');
const upload = multer({dest: 'tmp/'});

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

            // check upload file
            let file = req.file;
            if (file) {
               console.log("file:" + file.originalname);
               body.params.file = fs.createReadStream(file.path);
            } else {
               console.log('error: no params');
               res.status(500).send({"error": "Failed Watson Discovery addDocument. no params."});
               return;
            }

            discovery.addDocument(body.params)
               .then(response => {
                  // console.log(JSON.stringify(response.result, null, 2));
                  res.json(response.result);
               })
               .catch(err => {
                  console.log('error:', err);
                  res.status(500).send({"error": "Failed Watson Discovery addDocument."});
               });
            break;

         default:
            console.log("Unsupported api!");
            res.status(500).send({"error": "Unsupported api!"});
            break;
      }
   })

   .post('/:api/:pid/:cid', upload.single('tmpfile'), async (req, res) => {
      // Path params
      let api = req.params.api;
      if (!api) {
         console.log('error: no params api');
         res.status(500).send({"error": "Failed Watson Discovery addDocument."});
      }
      let pid = req.params.pid;
      if (!pid) {
         console.log('error: no params projectId');
         res.status(500).send({"error": "Failed Watson Discovery addDocument."});
      }
      let cid = req.params.cid;
      if (!cid) {
         console.log('error: no params collectionId');
         res.status(500).send({"error": "Failed Watson Discovery addDocument."});
      }

      // check Discovery env
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

      // check upload file
      let file = req.file;
      if (file) {
         console.log("file:" + file.originalname);
      } else {
         console.log('error: no params');
         res.status(500).send({"error": "Failed Watson Discovery addDocument. no params."});
         return;
      }

      switch (api) {
         case "addDocument":
            const addParams = {
               projectId: pid,
               collectionId: cid,
               file: fs.createReadStream(file.path),
               filename: file.originalname,
               fileContentType: file.mimetype,
            };

            discovery.addDocument(addParams)
               .then(response => {
                  // console.log(JSON.stringify(response.result, null, 2));
                  res.json(response.result);
               })
               .catch(err => {
                  console.log('error:', err);
                  res.status(500).send({"error": "Failed Watson Discovery addDocument."});
               });
            break;

         default:
            console.log("Unsupported api!");
            res.status(500).send({"error": "Unsupported api!"});
            break;
      }
   });

const port = process.env.PORT || 8080;
server.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log('Watson Discovery Server running on port: %d', port);
});

