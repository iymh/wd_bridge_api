// console.log wrapper
const isLog = true;
function LOG(...args) {
   if (isLog) console.log(...args);
}
// console.log color
const C_RED = '\x1B[31m';
const C_RST = '\x1B[0m';

// const AUTHINFO = {
//    username:"test",
//    password:"test"
// };

const express = require('express');
const bodyParser = require('body-parser');
const basicAuth = require('basic-auth-connect');
const cors = require('cors');
require('dotenv').config({ debug: isLog });

// File upload function
const fs = require('fs');
const multer = require('multer');
const upload = multer({dest: 'tmp/'});

const DiscoveryV2 = require('ibm-watson/discovery/v2');
const { IamAuthenticator } =require('ibm-watson/auth');
const WD_VARSION = '2023-03-31';

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
   // .use(basicAuth(
   //    AUTHINFO.username,
   //    AUTHINFO.password 
   // ))

   .get('/', function (req, res) {
      res.send('watson discovery bridge!')
   })

   // Internal API
   .get('/:pid/:cid/:did', async (req, res) => {
      // Path params
      let pid = req.params.pid;
      if (!pid) {
         LOG('error: no params projectId');
         res.status(500).send({"error": "Failed Watson Discovery Original."});
      }
      let cid = req.params.cid;
      if (!cid) {
         LOG('error: no params collectionId');
         res.status(500).send({"error": "Failed Watson Discovery Original."});
      }
      let did = req.params.did;
      if (!did) {
         LOG('error: no params collectionId');
         res.status(500).send({"error": "Failed Watson Discovery Original."});
      }
      LOG("original", pid, cid, did);

      // check Discovery env
      if (typeof process.env.API_KEY == 'undefined') {
         console.error('Error: "API_KEY" is not set.');
         console.error('Please consider adding a .env file with API_KEY.');
         res.status(500).send({"error": "Failed Watson Discovery original path."});
      }

      // https://api.jp-tok.discovery.watson.cloud.ibm.com/instances/0641b7ee-c68f-45b6-82e5-bdad10f1fd60
      // /v2/internal/projects/db21700c-ed41-4310-bb9b-e605fd1e7823/collections/f7c46524-7139-7896-0000-0190ee1d3013/documents/f3f4084c0969a6e4f2309873df97ba1c/original
      let url = `${process.env.API_BASE_URL}/v2/internal/projects/${pid}/collections/${cid}/documents/${did}/original`;
      console.log(url);

      let response = await fetch(url, {
         method:'GET', 
         headers: {'Authorization': 'Basic ' + btoa(`apikey:${process.env.API_KEY}`)}});
      let data = await response.arrayBuffer();
      console.log(data);
      if (data) {
         res.status(200).send(new Buffer.from(data, 'binary'));
      } else {
         res.status(500).send({"error": "Failed Watson Discovery original path."});
      }
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
         // version: '{version}',
         authenticator: new IamAuthenticator({
            apikey: process.env.API_KEY,
         }),
         version: WD_VARSION,
         serviceUrl: process.env.API_BASE_URL,
      });

      switch (body.api) {
         case "query":
            discovery.query(body.params)
               .then(response => {
                  // LOG(`${C_RED}${body.api}${C_RST}\n`, JSON.stringify(response.result, null, 2));
                  res.json(response.result);
               })
               .catch(err => {
                  LOG('error:', err);
                  res.status(500).send({"error": "Failed Watson Discovery query."});
               });
            break;

         case "listProjects":
            discovery.listProjects()
               .then(response => {
                  LOG(`${C_RED}${body.api}${C_RST}\n`, JSON.stringify(response.result, null, 2));
                  res.json(response.result);
               })
               .catch(err => {
                  LOG('listProjects error:', err);
                  res.status(500).send({"error": "Failed Watson Discovery listProjects."});
               });
            break;

         case "listCollections":
            discovery.listCollections(body.params)
               .then(response => {
                  LOG(`${C_RED}${body.api}${C_RST}\n`, JSON.stringify(response.result, null, 2));
                  res.json(response.result);
               })
               .catch(err => {
                  LOG('error:', err);
                  res.status(500).send({"error": "Failed Watson Discovery listCollections."});
               });
            break;

         case "listTrainingQueries":
            discovery.listTrainingQueries(body.params)
               .then(response => {
                  LOG(`${C_RED}${body.api}${C_RST}\n`, JSON.stringify(response.result, null, 2));
                  res.json(response.result);
               })
               .catch(err => {
                  LOG('error:', err);
                  res.status(500).send({"error": "Failed Watson Discovery listTrainingQueries."});
               });
            break;

         case "createTrainingQuery":
            discovery.createTrainingQuery(body.params)
               .then(response => {
                  LOG(`${C_RED}${body.api}${C_RST}\n`, JSON.stringify(response.result, null, 2));
                  res.json(response.result);
               })
               .catch(err => {
                  LOG('error:', err);
                  res.status(500).send({"error": "Failed Watson Discovery createTrainingQuery."});
               });
            break;

         case "getTrainingQuery":
            discovery.getTrainingQuery(body.params)
               .then(response => {
                  LOG(`${C_RED}${body.api}${C_RST}\n`, JSON.stringify(response.result, null, 2));
                  res.json(response.result);
               })
               .catch(err => {
                  LOG('error:', err);
                  res.status(500).send({"error": "Failed Watson Discovery getTrainingQuery."});
               });
            break;

         case "updateTrainingQuery":
            discovery.updateTrainingQuery(body.params)
               .then(response => {
                  LOG(`${C_RED}${body.api}${C_RST}\n`, JSON.stringify(response.result, null, 2));
                  res.json(response.result);
               })
               .catch(err => {
                  LOG('error:', err);
                  res.status(500).send({"error": "Failed Watson Discovery updateTrainingQuery."});
               });
            break;

         default:
            LOG(`${C_RED}${body.api}${C_RST}\n`, "Unsupported api!");
            res.status(500).send({"error": "Unsupported api!"});
            break;
      }
   })

   .post('/:api/:pid/:cid', upload.single('tmpfile'), async (req, res) => {
      // Path params
      let api = req.params.api;
      if (!api) {
         LOG('error: no params api');
         res.status(500).send({"error": "Failed Watson Discovery addDocument."});
      }
      let pid = req.params.pid;
      if (!pid) {
         LOG('error: no params projectId');
         res.status(500).send({"error": "Failed Watson Discovery addDocument."});
      }
      let cid = req.params.cid;
      if (!cid) {
         LOG('error: no params collectionId');
         res.status(500).send({"error": "Failed Watson Discovery addDocument."});
      }

      // check Discovery env
      if (typeof process.env.API_KEY == 'undefined') {
         console.error('Error: "API_KEY" is not set.');
         console.error('Please consider adding a .env file with API_KEY.');
         process.exit(1);
      }

      const discovery = new DiscoveryV2({
         // version: '{version}',
         authenticator: new IamAuthenticator({
            apikey: process.env.API_KEY,
         }),
         version: WD_VARSION,
         serviceUrl: process.env.API_BASE_URL,
      });

      // check upload file
      let file = req.file;
      if (file) {
         LOG("file:" + file.originalname);
      } else {
         LOG('error: no params');
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
                  LOG(`${C_RED}${api}${C_RST}\n`, JSON.stringify(response.result, null, 2));
                  res.json(response.result);
               })
               .catch(err => {
                  LOG('error:', err);
                  res.status(500).send({"error": "Failed Watson Discovery addDocument."});
               });
            break;

         default:
            LOG(`${C_RED}${api}${C_RST}\n`, "Unsupported api!");
            res.status(500).send({"error": "Unsupported api!"});
            break;
      }
   });

const port = process.env.PORT || 8080;
server.listen(port, () => {
  // eslint-disable-next-line no-console
  LOG(`Watson Discovery Server running on port: ${C_RED}${port}${C_RST}`);
});

