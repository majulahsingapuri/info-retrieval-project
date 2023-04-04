const SolrNode = require('solr-node');

const updateVoting ={
    "DATE":["12/03/2007"],
    "AUTHOR":["ks"],
    "TEXT":["Zippy 6-speed wagon in a color to match...Montego blue. Handles well and grips the road. Run-flat tires don't add noise like my former X3. Gas mileage is excellent with the manual transmission."],
    "YEAR":[2008],
    "MANUFACTURER":["bmw"],
    "MODEL":["3 series"],
    "LABEL":[1],
    "VOTES":[1005004],
    "id":"9b682c28-544e-4b8f-9f36-3d8ae2005ce2"
}

var client = new SolrNode({
    host: '127.0.0.1',
    port: '8983',
    core: 'info_retrieval',
    protocol : 'http'
})

client.delete(updateVoting, function(err, result){
    if(err){
        console.log(err);
        return;
    }
    console.log('Response: ', result.responseHeader);
});

