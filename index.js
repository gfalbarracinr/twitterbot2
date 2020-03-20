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
    console.log(response);
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
    console.log(new Date());
    if (err) {
        console.log('Twitter error: ', err.message);
    } else {
        console.log('A new report was generated.');
    }
}

var j = schedule.scheduleJob('* 10 * * *', function(fireDate){
     console.log('Scheduler running at ', fireDate);
     changeStatus();
});