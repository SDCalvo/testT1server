const dotenv = require('dotenv');
dotenv.config();
let chai = require('chai');
let chaiHttp = require('chai-http');
const expect = require('chai').expect;
const mongoose = require('mongoose');
const products = require('../models/productsModel');
const users = require('../models/userModel');
const app = require('../server');

chai.use(chaiHttp);
const url= 'https://hulkstoreserver.herokuapp.com';
const token = process.env.ADMIN_TEST_TOKEN;

//start server before tests run
describe('conection', () => {
    before(done => {
        app.on('ready', () => {
            done();
        });
    });
    //close server after tests run
    after(done => {
        app.close(() => {
            done();
        });
    });
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
                "img": "https://image.shutterstock.com/image-vector/ui-image-placeholder-wireframes-apps-260nw-1037719204.jpg"
            })
            .end((err, res) => {
                expect(res).to.have.status(201);
                expect(res.body).to.be.a('object');
                expect(res.body.name).to.equal('Test product');                
                //delete product after test
                products.deleteOne({ name: 'Test product' }, (err) => {
                    if (err) {
                        console.log(err);
                    }
                    done();
                });
            });
    });

    it('should update a product', (done) => {
        const product = new products({
            "name": "Test product 2",
            "description": "Test description",
            "price": "100",
            "stock": "10",
            "img": "https://image.shutterstock.com/image-vector/ui-image-placeholder-wireframes-apps-260nw-1037719204.jpg"
        });
        product.save((err, product) => {
            chai.request(url)
                .patch('/products/' + product._id)
                .set('x-access-token', token)
                .set('content-type', 'application/json')
                .send({
                    "name": "Test product 3",
                    "description": "Test description",
                    "price": "100",
                    "stock": "10",
                    "img": "https://image.shutterstock.com/image-vector/ui-image-placeholder-wireframes-apps-260nw-1037719204.jpg"
                })
                .end((err, res) => {
                    expect(res).to.have.status(201);
                    expect(res.body).to.be.a('object');
                    expect(res.body.name).to.equal('Test product 3');
                    //delete product after test
                    products.deleteOne({ name: 'Test product 3' }, (err) => {
                        if (err) {
                            console.log(err);
                        }
                        done();
                    });
                });
        });
    });

    it('should delete a product', (done) => {
        const product = new products({
            "name": "Test product 4",
            "description": "Test description",
            "price": "100",
            "stock": "10",
            "img": "https://image.shutterstock.com/image-vector/ui-image-placeholder-wireframes-apps-260nw-1037719204.jpg"
        });
        product.save((err, product) => {
            chai.request(url)
                .delete('/products/' + product._id)
                .set('x-access-token', token)
                .set('content-type', 'application/json')
                .end((err, res) => {
                    expect(res).to.have.status(201);
                    expect(res.body).to.be.a('object');
                    expect(res.body.message).to.equal('Producto eliminado');
                    done();
                });
        });
    });
});

describe('User', () => {

    it('should return all users', (done) => {
        chai.request(url)
            .get('/user')
            .set('x-access-token', token)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('array');
                expect(res.body.length).to.be.above(0);
                done();
            });
    });

    it('should create a new user', (done) => {
        chai.request(url)
            .post('/user')
            .set('content-type', 'application/json')
            .send({
                "name": "Test user",
                "lastName": "Test lastName",
                "email": "test@test.com",
                "password": "test"
            })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('object');
                expect(res.body.name).to.equal('Test user');
                expect(res.body.role).to.equal('user');
                //delete user after test
                users.deleteOne({ name: 'Test user' }, (err) => {
                    if (err) {
                        console.log(err);
                    }
                    done();
                });
            });
    });

    it('should login', (done) => {

        //first make a request to create a new user
        chai.request(url)
            .post('/user')
            .set('content-type', 'application/json')
            .send({
                "name": "Test user2",
                "lastName": "Test lastName",
                "email": "test2@test.com",
                "password": "test"
            })
            .end((err, res) => {
                //then login
                chai.request(url)
                    .post('/user/login')
                    .set('content-type', 'application/json')
                    .send({
                        "email": "test2@test.com",
                        "password": "test"
                    })
                    .end((err, res) => {
                        expect(res).to.have.status(200);
                        expect(res.body).to.be.a('object');
                        expect(res.body.name).to.equal('Test user2');
                        expect(res.body.role).to.equal('user');
                        //delete user after test
                        users.deleteOne({ name: 'Test user2' }, (err) => {
                            if (err) {
                                console.log(err);
                            }
                            done();
                        });
                    });
            });
    });
});
