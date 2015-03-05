/* global module */

var express = require('express');
var router = express.Router();

var infxClasses = [
    {
        id: 'BSI',
        name : 'BloodStream infection'
    },
    {
        id : 'PNEUMO',
        name: 'Pneumonia'},
    {
        id: 'UTI',
        name: 'Urinary Tract Infection'
    },
    {
        id: 'SSI',
        name: 'Surgical Site Infection'
    },
    {
        id: 'BJ',
        name: 'Bone and Joint infection'
    },
    {
        id: 'CNS',
        name: 'Central Nervous System'
    },
    {
        id: 'CVS',
        name: 'Cardio-Vascular Systen'
    },
    {
        id: 'EENT',
        name: 'Eye, Ear, Nose, Throat, or mouth infections'
    },
    {
        id: 'GI',
        name: 'Gastro-Intestinal system infection'
    },
    {
        id: 'LRI',
        name: 'Lower Respiratory tract Infection, other than pneumonia'
    },
    {
        id: 'REPR',
        name: 'REPRoductive tract infection'
    },
    {
        id: 'SST',
        name: 'Skin and Soft Tissue infection'
    },
    {
        id: 'SYS',
        name: 'SYStemic Infection'
    }
];



router.get('/', function (req, res, next) {
    infxClass(req, res);
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


/** 
 * Get the infection classes
 * 
 * @param {Request} req
 * @param {Response} res
 */
function infxClass(req, res) {

    console.log("Returning infection classes");
    res.write(JSON.stringify(infxClasses));
    res.end();
    console.log("Done with infection classes request");
}
;


module.exports = router;
