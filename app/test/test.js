var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../js/app');

var expect = chai.expect;

chai.use(chaiHttp);
// reference: https://github.com/chaijs/chai-http
describe('App', function() {
    describe('/authorize/qrcode', function() {
        it('responds with status 400', function(done) {
            chai.request(app)
                .post('/authorize/qrcode').send({
                'qrcode': 'fake',
                'username': '123'
            }).then(function( res) {
                    expect(res).to.have.status(400);
                    done();
                });
        });
    });
});