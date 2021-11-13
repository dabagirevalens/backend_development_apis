const router = require("express").Router();
const mongoose = require("mongoose");


const uri = "mongodb+srv://ciao:ciao@cluster0.ogg8o.mongodb.net/database?retryWrites=true&w=majority";

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

let schema = new mongoose.Schema({
    username: String,
    exercices: [{
        description: {
            type: String
        },
        duration: {
            type: Number
        },
        date: {
            type: String,
            required: false
        }
    }]
})
let Users = mongoose.model("Users", schema)

const defaultDate = () => new Date().toDateString()

app.post("", (req, res) => {
    let user = new Users({
        username: req.body.username
    })
    user.save((err, data) => {
        if (err) return console.log(err)
        console.log("User saved successfully")
    })
    res.json(user)
})
app.get("", (req, res) => {
    Users.find({
        username: /\w/
    }, (err, data) => {
        if (err) return console.log(err)
        res.json(data)
    })
})
app.post("/:_id/exercises", (req, res) => {
    const userId = req.params._id
    let exercises = {
        description: req.body.description,
        duration: Number(req.body.duration),
        date: req.body.date || defaultDate()
    }
    Users.findByIdAndUpdate(
        userId, // find user by _id
        {
            $push: {
                exercices: exercises
            }
        }, // add exObj to exercices[]
        {
            new: true
        },
        (err, data) => {
            if (err) return console.log(err)
            let returnObj = {
                username: data.username,
                description: exercises.description,
                duration: exercises.duration,
                _id: userId,
                date: new Date(exercises.date).toDateString()
            };
            res.json(returnObj);
        }
    );
})
app.get("/:_id/logs", function (req, res) {
    const {
        from,
        to,
        limit
    } = req.query;
    Users.findById(req.params._id, function (err, data) {
        if (err) console.error(err);
        const count = data.exercices.length;
        // return console.log(data.exercices.length);
        Users.findOneAndUpdate({
            _id: data._id
        }, {
            count: count
        }, {
            new: true
        },
            function (err, data) {
                if (err) console.error(err);
                let log = data.exercices;
                console.log(log);
                // descending
                log.sort(function (log1, log2) {
                    return Date.parse(log1.date) - Date.parse(log2.date);
                });
                if (from != undefined) {
                    const f = Date.parse(from);
                    log.filter(log => Date.parse(log.date) >= f);
                    console.log(from);
                }
                if (to != undefined) {
                    const t = Date.parse(to);
                    log.filter(log => Date.parse(log.date) <= t);
                    console.log(to);
                }
                if (limit != undefined) {
                    log = log.slice(0, limit);
                    console.log(limit);
                }
                res.json({
                    username: data.username,
                    count: log.length,
                    _id: data._id,
                    log: log
                });
            }
        );
    });
});

module.exports = router;
