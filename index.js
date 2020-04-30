const Sentry = require('@sentry/node');
const Report = require('./report.js');
const Twit = require('twit');
const config = require('./config.js');
const axios = require('axios');
var schedule = require('node-schedule');

const api = 'https://corona.lmao.ninja/v2/countries/colombia';
const T = new Twit(config);
Sentry.init({ dsn: 'https://67bab4471c6644c79663f40a63bede2a@o385617.ingest.sentry.io/5218710' });

T.get('account/verify_credentials',  {
    include_entities: false,
    skip_status: true,
    include_email: false
}, onAuthenticated);


const getData = async () =>  {
    try {
        const response = await axios.get(api);
        const data = await response.data;
        return data;
    } catch (error){
        return undefined;
    }
        
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
    response = await getData();
    if (response === undefined) return;
    const report = new Report(response);
    const allowed = report.compareToPrevious();
    if (allowed) {
        tweet(report);
    }
}

function tweet (report) {
    T.post(
        'statuses/update',
        {
            status: `Reporte de casos de Coronavirus Colombia
                Infectados: ${report.cases}
                Recuperados: ${report.recovered}
                Muertos: ${report.deaths}
                Pruebas realizadas: ${report.tests}
                #Covid_19 #coronavirus
            `
        }, onTweeted
    );
    report.saveReport();
}

function onTweeted(err) {
 //Here we have to connect to slack if error
}

var j = schedule.scheduleJob('0 */2 * * *', function(fireDate){
    changeStatus();
});

