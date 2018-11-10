var express = require("express");
var router = express.Router();
var problemService = require("../services/problemService");
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json();

const nodeRestClient = require('node-rest-client').client;
const restClient = new nodeRestClient();
const EXECUTOR_SERVER_URL = 'http://localhost:5000/build_and_run';

//register remote method
restClient.registerMethod('build_and_run', EXECUTOR_SERVER_URL, 'POST');

router.get("/problems", function (req, res) {
    problemService.getProblems()
        .then(problems => res.json(problems));
});

router.get("/problems/:id", function (req, res) {
    var id = req.params.id;
    problemService.getProblem(+id).then(problem => res.json(problem));
});

router.post("/problems", jsonParser, function (req, res) {
    problemService.addProblem(req.body).then(function(problem) {
        res.json(problem);
    }, function(error) {
        res.status(400).send(error);
    });
});

//build and run
router.post('/build_and_run', jsonParser, function (req, res) {
    const userCodes = req.body.userCodes;
    const lang = req.body.lang;
    console.log(lang + ' ' + userCodes);
    //res.json({'text':'hello from nodejs'});

    restClient.methods.build_and_run(
        {
            data: {
                code: userCodes,
                lang: lang
            },
            headers: {
                'Content-Type': 'application/json'
            }
        },
        (data, response) => {
            console.log('received response from executor service..');
            const text = `Build output: ${data['build']}     Run output: ${data['run']}`;
            console.log('text is ...', text);
            data['text'] = text;
            res.json(data);
        }
    )

});

module.exports = router;
