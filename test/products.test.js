const dotenv = require('dotenv');
dotenv.config();
let chai = require('chai');
let chaiHttp = require('chai-http');
const expect = require('chai').expect;
const mongoose = require('mongoose');
const products = require('../models/productsModel');
const server = require('../server');

chai.use(chaiHttp);
const url= 'https://hulkstoreserver.herokuapp.com';
const token = process.env.ADMIN_TEST_TOKEN;

//start server before tests run
before(function(done){
    server.listen(done);
});


//Test for products
describe('Products', () => {
    it('should return all products', (done) => {
        chai.request(url)
            .get('/products')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('array');
                expect(res.body.length).to.be.above(0);
                done();
            });
    });

    it('should return a product by id', (done) => {
        chai.request(url)
            .get('/products/615634e22260280b3c600b7f')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('object');
                expect(res.body._id).to.equal('615634e22260280b3c600b7f');
                done();
            });
    });

    it('should post a new product', (done) => {
        chai.request(url)
            .post('/products')
            .set('x-access-token', token)
            .set('content-type', 'application/json')
            .send({
                "name": "Test product",
                "description": "Test description",
                "price": "100",
                "stock": "10",
                "img": "test.jpg"
            })
            .end((err, res) => {
                expect(res).to.have.status(201);
                expect(res.body).to.be.a('object');
                expect(res.body.name).to.equal('Test product');                
                done();
            });
    });

    it('should update a product', (done) => {
        const product = new products({
            "name": "Test product 2",
            "description": "Test description",
            "price": "100",
            "stock": "10",
            "image": "test.jpg"
        });
        product.save((err, product) => {
            chai.request(url)
                .put('/products/' + product._id)
                .set('x-access-token', token)
                .set('content-type', 'application/json')
                .send({
                    "name": "Test product 2",
                    "description": "Test description",
                    "price": "100",
                    "stock": "10",
                    "img": "test.jpg"
                })
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('object');
                    expect(res.body.name).to.equal('Test product 2');
                    done();
                });
        });
    });
});


