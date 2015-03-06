/* global module */

var express = require('express');
var router = express.Router();

router.get(
        '/',
        /**
         * Function to handle the request
         * @param {type} req
         * @param {type} res
         * @param {type} next
         * @returns {undefined}
         */
        function (req, res, next) {
            infxClass(req, res);
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


        /** 
         * Get the infection classes
         * 
         * @param {Request} req
         * @param {Response} res
         */
        function infxClass(req, res) {
            var infxClassSQL = "SELECT UPPER (code) as abbrev, description, display_order \
                            FROM td_inf_document_code_desc \
                            WHERE parent_code = 'infxClass' \
                            ORDER BY display_order";
            console.log(infxClassSQL);
            console.log("Returning infection classes");
            conn.execute(infxClassSQL,
                    [],
                    {outFormat: oracle.OBJECT},
            function (err, results) {
                if (err) {
                    console.log("Error executing query:", err);
                    res.status(500).send({error: "Error executing query: " + err, query: infxClassSQL});
                    res.end();
                }

                // use the JSON function to format the results and print
                res.write(JSON.stringify(results.rows));
                res.end();
                console.log("Done with infection classes request");
            });
        }
        ;


        module.exports = router;
