let request = require('supertest');
request = request('http://localhost:3000/api/admin/')

const expect = require('chai').expect;

const token = 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQHdvcmt3aXRodXMuY29tIiwiaWF0IjoxNTY4OTY3OTc2fQ.3Qlzg_3MwGDXZYkJPCIVIY_lWMXoF4WM-A25FexBFkM'
let portfolioId
let offerId

describe('Admin test', function () {

    it('Get portfolios that are unPublished', done => {
        request
            .get('portfolios')
            .set('Content-Type', 'application/json')
            .set('Authorization', token)
            .expect('Content-Type', /json/)
            .expect(200, (err, res) => {
                const portfolios = res.body.payload
                expect(portfolios).to.be.an('array')
                portfolios.forEach(element => {
                    expect(element.is_published).to.equal(false)
                });
                portfolioId = portfolios[0].id
                done()
            })
    })

    it('Get offers that are unPublished', done => {
        request
            .get('offers')
            .set('Content-Type', 'application/json')
            .set('Authorization', token)
            .expect('Content-Type', /json/)
            .expect(200, (err, res) => {
                const offers = res.body.payload
                expect(offers).to.be.an('array')
                offers.forEach(element => {
                    expect(element.is_published).to.equal(false)
                });
                offerId = offers[0].id
                done()
            })
    })

    it('publish portfolio to the public', done => {
        request
            .put(`portfolios/publish/${portfolioId}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', token)
            .expect('Content-Type', /json/)
            .expect(200, (err, res) => {
                expect(res.body.payload.is_published).to.equal(true)
                done()
            })
    })

    it('publish offer to the public', done => {
        request
            .put(`offers/publish/${offerId}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', token)
            .expect('Content-Type', /json/)
            .expect(200, (err, res) => {
                expect(res.body.payload.is_published).to.equal(true)
                done()
            })
    })

})
