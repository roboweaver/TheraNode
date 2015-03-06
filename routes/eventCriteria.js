/* global module */

var express = require('express');
var router = express.Router();

router.get('/eventCriteria/:id', function (req, res, next) {
    eventCriteria(req, res);
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
        
function eventCriteria(req, res) {
    var eventCriteriaSQL = "SELECT  TD_NHSN_EVENT_CRITERIA.TD_NHSN_EVENT_CRITERIA_ID as \"id\" \n\
        ,event_type \n\
		,event_description \n\
		,code_system \n\
		,code \n\
		,td_nhsn_criteria_ids \n\
		,min_age \n\
		,max_age \n\
		,gender \n\
  FROM td_nhsn_event, td_nhsn_event_criteria \n\
 WHERE	  td_nhsn_event.td_nhsn_event_id = td_nhsn_event_criteria.td_nhsn_event_id \n\
		 AND TD_NHSN_EVENT.TD_STATUS_ID = 1 \n\
		 AND TD_NHSN_EVENT_CRITERIA.TD_STATUS_ID = 1 \n\
         and TD_NHSN_EVENT.EVENT_TYPE = :1";

    conn.execute(eventCriteriaSQL, 
    [req.params.id], 
            {outFormat: oracle.OBJECT},
    function (err, results) {
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
