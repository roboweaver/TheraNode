var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    criteriaList(req, res);
});

router.get('/event/rule/:id', function (req, res, next) {
    criteriaForEventRules(req, res);
});

router.get('/find/:id', function (req, res, next) {
    criteriaFind(req, res);
});

router.get('/death', function (req, res, next) {
    criteriaDeath(req, res);
});

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


/** function registered in the /event declaration
 * 
 * @param {Request} req
 * @param {Response} res
 */
function criteriaList(req, res) {
    console.log('Get criteria (no parameters)');
    var criteriaListSQL = "select td_nhsn_criteria_id as \"id\", \n\
                        criteria as \"label\", \n\
                        'string' as \"type\" \n\
                    from td_nhsn_criteria ";
    console.log(criteriaListSQL);
    conn.execute(criteriaListSQL, [], function (err, results) {
        if (err) {
            console.log("Error executing query:", err);
            return;
        }
        console.log("Write the JSON output");
        // use the JSON function to format the results and print
        res.write(JSON.stringify(results));
        console.log("Close the response");
        res.end();
        console.log("Wait for next request");
    });
}
;

/**
 * Criteria for Event Rules ...
 * @param {Request} req
 * @param {Response} res
 */
function criteriaForEventRules(req, res) {
    var criteriaForEventRulesSQL = "SELECT * \n\
                                    FROM td_nhsn_criteria \n\
                                   WHERE td_nhsn_criteria_id IN \n\
                                            (SELECT ids.COLUMN_VALUE \n\
                                                FROM TABLE ( SELECT TD_UTIL_PKG.csl_to_number_table ( tnec.TD_NHSN_CRITERIA_IDS) \n\
                                                               FROM TD_NHSN_EVENT_CRITERIA tnec \n\
                                                              WHERE tnec.TD_NHSN_EVENT_CRITERIA_ID = :1) ids)";

    conn.execute(criteriaForEventRulesSQL, [req.params.id], function (err, results) {
        if (err) {
            console.log("Error executing query:", err);
            return;
        }

        // use the JSON function to format the results and print
        res.write(JSON.stringify(results));
        res.end();
    });
}
;

/**
 * function registered in the /event declaration
 * @param {Request} req
 * @param {Response} res
 */
function criteriaDeath(req, res) {
    var criteriaDeathSQL = "select td_nhsn_criteria_id as \"id\", \n\
                        criteria as \"label\", \n\
                        'string' as \"type\" \n\
                    from td_nhsn_criteria\n\
                    where death_criteria = 1 ";
    conn.execute(criteriaDeathSQL, [], function (err, results) {
        if (err) {
            console.log("Error executing query:", err);
            return;
        }

        // use the JSON function to format the results and print
        res.write(JSON.stringify(results));
        res.end();
    });
}
;
/**
 * function registered in the /event by ID
 * @param {Request} req
 * @param {Response} res
 */
function criteriaFind(req, res) {
    var criteriaFindSQL = "select * \n\
                      from td_nhsn_criteria \n\
                     where td_nhsn_criteria_id = :1";
    conn.execute(criteriaFindSQL, [req.params.id], function (err, results) {
        if (err) {
            console.log("Error executing query:", err);
            return;
        }

        // use the JSON function to format the results and print
        res.write(JSON.stringify(results));
        res.end();
    });
}
;


module.exports = router;
