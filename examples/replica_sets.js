GLOBAL.DEBUG = true;

sys = require("sys");
test = require("assert");

var Db = require('../lib/mongodb').Db,
    Server = require('../lib/mongodb').Server,
    ReplicaSets = require('../lib/mongodb').ReplicaSets;

var host = process.env['MONGO_NODE_DRIVER_HOST'] != null ? process.env['MONGO_NODE_DRIVER_HOST'] : 'localhost';
var servers = [
    new Server(host, 27017),
    new Server(host, 27018),
    new Server(host, 27019),
];

//when executed you need to kill master server (in background)
//...
//after execution do inspect values in collection 'baz'

var db = new Db('node-mongo-examples', new ReplicaSets(servers), {replicaSets: true});

// smart collection functionality used
db.initCollections('baz');
db.baz.remove();

var i = 0;
var interval = setInterval(function(){

    if (++i > 2000) {
        clearInterval(interval);
        return;
    }

    db.baz.insert({cnt: i}, {safe: true}, function(err, doc){
        if (err) {
            sys.puts(sys.inspect(err));
            return;
        }
        sys.puts(doc[0].cnt);
    })

}, 10);