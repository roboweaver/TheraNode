var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    eventList(req, res, next);
}
);

// Look up by id
router.get('/:id', function (req, res, next) {
    eventFind(req, res, next);
}
);

// Look up by id
router.get('/parent/:infxclass', function (req, res, next) {
    eventByParent(req, res, next);
}
);

// Set up the connection to Oracle ...
var oracle = require('oracledb');
var conn;

// Connection data
var connectData = {
    connectString: "rob2012.theradoc.com:1521/tdoc",
    user: "tdrun",
    password: "smrt600"
};

oracle.getConnection(connectData,
        function (err, connection) {
            if (err) {
                console.log("Error connecting to db:", err);
                return;
            }
            console.log('connected');
            conn = connection;
        });
        
// function registered in the /event declaration
function eventList(req, res, next) {
    var eventListSQL = "select td_nhsn_event_id as \"id\", \
                        event_description as \"label\", \
                        'string' as \"type\" \
                    from td_nhsn_event ";
    console.log(eventListSQL);
    conn.execute(eventListSQL, [], function (err, results) {
        if (err) {
            console.log("Error executing query:", err);
            res.status(500).send({error: "Error executing query: " + err, query : eventListSQL});
            res.end();
            return;
        }

        // use the JSON function to format the results and print
        res.write(JSON.stringify(results));
        res.end();
    });
}
;


// function registered in the /event by ID
function eventFind(req, res, next) {
    var eventList = "select * from td_nhsn_event_criteria where td_nhsn_event_id = :1";
    conn.execute(eventList, [req.params.id], function (err, results) {
        if (err) {
            console.log("Error executing query:", err);
            res.status(500).send({error: "Error executing query: " + err, query : eventList, id: req.params.id});
            res.end();
            return;
        }

        // use the JSON function to format the results and print
        res.write(JSON.stringify(results));
        res.end();
    });
}
;

function eventByParent(req, res, next) {
    var eventByParentSQL = "SELECT event_type, event_description \
                        FROM td_nhsn_event \
                    WHERE (UPPER ( :1) || '_' || UPPER (event_type) \
                            IN (SELECT UPPER (code) \
                                  FROM td_inf_document_code_desc \
                                  WHERE UPPER (parent_code) = UPPER (:1)))";
    conn.execute(eventByParentSQL, [req.params.infxclass], function (err, results) {
        if (err) {
            console.log("Error executing query:", err);
            res.status(500).send({error: "Error executing query: " + err, query : eventByParentSQL, id: req.params.id});
            res.end();
        }

        // use the JSON function to format the results and print
        res.write(JSON.stringify(results));
        res.end();
    });
}
;

module.exports = router;
