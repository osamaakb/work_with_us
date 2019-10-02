let request = require('supertest');
request = request('http://localhost:3000/api/users/')

const expect = require('chai').expect;

let user = {
    "email": "osamaakb@gmail.com",
    "password": "osama1998",
    "name": "osama akb"
}

describe('user tests', function () {

    it('perform user sign in and return JSON object contains token', done => {
        request
            .post('')
            .send(user)
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, (err, res) => {
                expect(res.body.success).to.equal(true)
                done()
            })            
    })

    it('perform user login and return JSON object contains token', done => {
        delete user.name
        request
            .post('login')
            .send(user)
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, (err, res) => {
                const resUser = res.body.payload
                expect(res.body.success).to.equal(true)
                expect(resUser.user.email).to.equal(user.email)
                expect(resUser.token).to.be.a('string')
                done()
            })            
    })




})
