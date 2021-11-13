const router = require("express").Router();
const dns = require("dns");

let links = [];
let id = 0;
app.post('', function (req, res) {
    const url = req.body.url;
    // return console.log(req.body);
    var regex = /^https?:\/\//;
    if (regex.test(url)) {

        var tempDnsUrl = url.slice(url.indexOf("//") + 2); 
        var slashIndex = tempDnsUrl.indexOf("/"); 
        var dnsUrl = slashIndex < 0 ? tempDnsUrl : tempDnsUrl.slice(0, slashIndex);

        console.log("slashIndex: " + slashIndex);
        console.log("dnsUrl: " + dnsUrl);

        dns.lookup(dnsUrl, function (err, address, family) { //check for valid url
            if (err) {
                console.log(err);
                res.json({
                    error: 'invalid url'
                })
            } else if (address !== undefined) {
                console.log("address: " + address);
                id++;
                const link = {
                    original_url: url,
                    short_url: `${id}`
                };
                links.push(link);
                console.log(link);
                return res.json(link);
                // findOriginalUrl(url); //check to see if url exists in database
            }
        }); //dns.lookup
    } else {
        res.json({
            error: 'invalid url'
        })
    }
});
app.get('/shorturl/:id', (req, res) => {
    const {
        id
    } = req.params;
    // return console.log(links);
    const link = links.find(a => a.short_url === id);
    if (link) {
        return res.redirect(link.original_url);
    } else {
        return res.json({
            error: 'No short url'
        });
    }
})

module.exports = router