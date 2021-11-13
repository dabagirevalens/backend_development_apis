const router = require("express").Router();

router.get("/:date", function (req, res) {

    let timestamp = req.params.date; // changed code 'req.params.date'
    if (timestamp.match(/\d{5,}/)) {
        timestamp = +timestamp;
    }
    let date = new Date(timestamp);
    if (date.toUTCString() == "Invalid Date") {
        res.json({ error: date.toUTCString() });
    }
    res.json({ unix: date.valueOf(), utc: date.toUTCString() });

});

// changed code for ' router.get ("/api" '
router.get("", (req, res) => {
    let date = new Date();
    res.json({ unix: date.valueOf(), utc: date.toUTCString() });
});

module.exports = router;
