let request = require('supertest');
request = request('http://localhost:3000/api/portfolios/')

const expect = require('chai').expect;

describe('portfolios test', function () {

    const token = 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1lbmFAZ21haWwuY29tIiwiaWF0IjoxNTY4NDU3NjI3fQ.FVt2LjDVKNLdYar3FbrqGQxocrSZxTAtc38n-i8kA8o' 
    let id;
    let portfolio = {
        "title": "new portfolios test",
        "category_id": "1",
        "area_id": "1",
        "job_type": "part",
        "name": "Muj",
        "phone": "+964770",
        "cv": "http://google.com"
    }
  
    it('should perform post request and return JSON object', done => {
        request
            .post('')
            .set('Content-Type', 'application/json')
            .set('Authorization', token)
            .send(portfolio)
            .expect('Content-Type', /json/)
            .expect(200, (err, res) => {
                const portfolio = res.body.payload
                id = res.body.payload.id
                expect(res.body.success).to.equal(true)
                expect(portfolio.title).to.equal('new portfolios test')
                expect(portfolio.user_id).to.equal(31)
                expect(portfolio.category_id).to.equal(1)
                expect(portfolio.area_id).to.equal(1)
                expect(portfolio.job_type).is.oneOf(['full', 'part', 'contract'])
                expect(portfolio.is_published).to.equal(false)
                expect(portfolio.cv).to.equal('http://google.com')
                expect(portfolio.name).to.equal('Muj')
                expect(portfolio.phone).to.equal('+964770')
                done()
            })
    })

    it('should send back a JSON object with success set to true and array of portfolios', function (done) {
        request
            .get('?area_id=1&category_id=1')
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, function (err, res) {
                if (err) { return done(err); }
                expect(res.body.success).to.equal(true)
                res.body.payload.forEach(element => {
                    expect(element.title).to.be.a('string')
                    expect(element.user_id).to.be.a('number')
                    expect(element.category_id).to.be.a('number')
                    expect(element.area_id).to.be.a('number')
                    expect(element.job_type).is.oneOf(['full', 'part', 'contract'])
                    expect(element.is_published).to.be.a('boolean')
                    expect(element.cv).to.be.a('string')
                    expect(element.name).to.be.a('string')
                    expect(element.phone).to.be.a('string')
                });
                done();
            });
    });

    it('should perform put request update the portfolio with a specific ID and return JSON object', done => {
        portfolio.id = id
        portfolio.title = 'new portfolios updated'
        request
            .put(`${id}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', token)
            .send(portfolio)
            .expect('Content-Type', /json/)
            .expect(200, (err, res) => {
                const portfolio = res.body.payload
                expect(res.body.success).to.equal(true)
                expect(portfolio.title).to.equal('new portfolios updated')
                expect(portfolio.user_id).to.equal(31)
                expect(portfolio.categoryId).to.equal(1)
                expect(portfolio.areaId).to.equal(1)
                expect(portfolio.job_type).is.oneOf(['full', 'part', 'contract'])
                expect(portfolio.is_published).to.equal(false)
                expect(portfolio.cv).to.equal('http://google.com')
                expect(portfolio.name).to.equal('Muj')
                expect(portfolio.phone).to.equal('+964770')
                done()
            })
    })


    it('should delete a portfolio with specific id', done => {
        request
            .delete(`${id}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', token)
            .expect('Content-Type', /json/)
            .expect(200, (err, res) => {
                done()
            })
    })
});