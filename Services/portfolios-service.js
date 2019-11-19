class PortfoliosService {

    static updateRate(new_rate, rate, rate_count) {
    
        console.log(new_rate)
        console.log(rate)
        console.log(rate_count)
        return parseInt(((rate * (rate_count - 1)) + new_rate) / rate_count, 10);
    }

}

module.exports = PortfoliosService;