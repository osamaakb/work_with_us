
let request = require('supertest');
request = request('http://localhost:3000/api/offers/')

const expect = require('chai').expect;


describe('offers test', function () {

    let id
    let skillId = []

    const token = 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1lbmFAZ21haWwuY29tIiwiaWF0IjoxNTY4NDU3NjI3fQ.FVt2LjDVKNLdYar3FbrqGQxocrSZxTAtc38n-i8kA8o'
    const offer = {
        "job_title": "new job offer",
        "category_id": "1",
        "area_id": "1",
        "operating_time": "14",
        "poeple_required": "5",
        "salary_from": "100",
        "salary_to": "500",
        "apply_method": "https://google.com",
        "job_desc": "this is a new job",
        "skills": [
            { "title": "test skill" },
            { "title": "test another skill" }
        ]
    }


    it('should perform post request for both offer and skills and return JSON object', done => {
        request
            .post('')
            .set('Content-Type', 'application/json')
            .set('Authorization', token)
            .send(offer)
            .expect('Content-Type', /json/)
            .expect(200, (err, res) => {
                const offer = res.body.payload
                id = offer.id
                expect(res.body.success).to.equal(true)
                expect(offer).to.be.an('object')
                skillId = offer.skills;
                done()
            })
    })


    it('should send back a JSON object with success set to true and array of offers', function (done) {
        request
            .get('')
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, function (err, res) {
                if (err) { return done(err); }
                expect(res.body.success).to.equal(true)
                res.body.payload.forEach(offer => {
                    expect(offer.job_title).to.be.a('string')
                    expect(offer.user_id).to.be.a('number')
                    expect(offer.category_id).to.be.a('number')
                    expect(offer.area_id).to.be.a('number')
                    expect(offer.operating_time).to.be.a('string')
                    expect(offer.poeple_required).to.be.a('number')
                    expect(offer.salary_from).to.be.a('number')
                    expect(offer.salary_to).to.be.a('number')
                    expect(offer.apply_method).to.be.a('string')
                    expect(offer.job_desc).to.be.a('string')
                });
                done();
            });
    });


    it('should perform put request for both offer and skills and return JSON object', done => {
        offer.id = id
        offer.skills = skillId
        offer.job_title = 'new job offer updated'
        request
            .put(``)
            .set('Content-Type', 'application/json')
            .set('Authorization', token)
            .send(offer)
            .expect('Content-Type', /json/)
            .expect(200, (err, res) => {
                const offer = res.body.payload
                expect(res.body.success).to.equal(true)
                expect(offer.job_title).to.equal('new job offer updated')

                done()
            })
    })

    it('should delete an offer with specific id', done => {
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
