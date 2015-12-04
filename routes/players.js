var express = require('express');
var router = express.Router();

/*
 * GET player list.
 */
router.get('/playerlist', function(req, res) {
    var db = req.db;
    var collection = db.get('players');
    collection.find({},{},function(e,docs){
        res.json(docs);
    });
});


/*
 * POST to addplayer.
 */
router.post('/addplayer', function(req, res) {
    var db = req.db;
    var collection = db.get('players');
    collection.insert(req.body, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

/*
 * DELETE to deleteplayer.
 */
router.delete('/deleteplayer/:id', function(req, res) {
    var db = req.db;
    var collection = db.get('players');
    var playerToDelete = req.params.id;
    collection.remove({ '_id' : playerToDelete }, function(err) {
        res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
    });
});


module.exports = router;
