const Twit = require('twit');
const config = require('./config.js');
const axios = require('axios');
var schedule = require('node-schedule');


const T = new Twit(config);

T.get('account/verify_credentials',  {
    include_entities: false,
    skip_status: true,
    include_email: false
}, onAuthenticated);


const getData = async () =>  {
    const response = await axios.get('https://corona.lmao.ninja/countries/colombia');
    const data = await response.data;
    return data;
        
}

var count = 0;

async function onAuthenticated(err) {
    if (err) {
        console.log(err);
    } else {
        console.log('Authentication succesful.');
    }   

    changeStatus();
     
}

async function changeStatus() {
    const response = await getData();
    T.post(
        'statuses/update',
        {
            status: `Reporte de casos de Coronavirus Colombia
                Infectados: ${response.cases}
                Recuperados: ${response.recovered}
                Muertos: ${response.deaths}
                #Covid_19
            `
        }, onTweeted
    );
}

function onTweeted(err) {
    count+=1;
}

var j = schedule.scheduleJob('42 * * * *', function(fireDate){
     changeStatus();
});