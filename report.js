const fs = require('fs');
class Report {
    constructor (report) {
        this.cases = report.cases;
        this.deaths = report.deaths;
        this.recovered = report.recovered;
        this.tests = report.tests;
    }

    compareToPrevious(){
        let rawdata = fs.readFileSync('state.json');
        let report = JSON.parse(rawdata);
        return !this.isEqualTo(report); 
    }

    saveReport(){
        fs.writeFileSync('state.json', JSON.stringify(this.toObject()))
    }

    isEqualTo(report) {
        return this.cases === report.cases && 
               this.deaths === report.deaths &&
               this.recovered === report.recovered &&
               this.tests === report.tests; 
    }

    toObject() {
        return {
            'cases': this.cases,
            'deaths': this.deaths,
            'recovered': this.recovered,
            'tests': this.tests
        }
    }
}
module.exports = Report;