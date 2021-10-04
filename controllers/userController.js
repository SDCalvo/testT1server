const userModel = require('../models/userModel.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//get all users
async function getUsers(req, res){
    try{
        const users = await userModel.find();
        res.json(users);
    }catch(err){
        res.json({message: err});
    }
}

//get user by id
async function getUserById(req, res){
    try{
        const user = await userModel.findById(req.params.id);
        if(!user) {
            res.json({message: 'Usuario no encontrado'});
        }
        res.json(user);
    }catch(err){
        res.json({message: err});
    }
}

//delete user
async function deleteUser(req, res){
    try{
        const user = await userModel.findByIdAndDelete(req.params.id);
        if(!user) {
            res.json({message: 'Usuario no encontrado'});
        }
        res.json({message: 'Usuario eliminado'});
    }catch(err){
        res.json({message: err});
    }
}

//create a user 
async function createUser(req, res) {

    const { email, password, name, lastName } = req.body;

    if(!email) {
        return res.status(400).send({
            message: 'El campo email es requerido'
        });
    }
    if(!password) {
        return res.status(400).send({
            message: 'El campo contraseña es requerido'
        });
    }
    if(!name) {
        return res.status(400).send({
            message: 'El campo nombre es requerido'
        });
    }
    if(!lastName) {
        return res.status(400).send({
            message: 'El campo apellido es requerido'
        });
    }
    
    
    try{
        //make sure user doesn't already exist
        const oldUser = await userModel.find({ email: email });
        console.log("oldUser: ", oldUser);
        if(oldUser.length > 0) {
            return res.status(400).send({
                message: 'El usuario ya existe'
            });
        }
        //hash password
        const hash = await bcrypt.hash(req.body.password, 10);

        const user = await userModel.create({
            email: email.toLowerCase(),
            password: hash,
            name,
            lastName,
            role: 'user',
        });

        const res = {...user}
        delete res.password;
        
        res.json(res);
    }
    catch(err){
        console.log("Error: ", err);
        res.status(500).send(err);
    }
}

async function login(req, res){
    const { email, password } = req.body;

    if(!email) {
        return res.status(400).send({
            message: 'El campo email es requerido'
        });
    }
    if(!password) {
        return res.status(400).send({
            message: 'El campo contraseña es requerido'
        });
    }

    try{
        const user = await userModel.find({ email: email });
        console.log("user:: ", user);
        if(!user) {
            return res.status(401).send({
                message: 'Usuario o contraseña incorrectos'
            });
        }
        console.log("password: ", user.password);
        const isValidPassword = await bcrypt.compare(password, user[0].password);

        if(!isValidPassword) {
            return res.status(401).send({
                message: 'Usuario o contraseña incorrectos'
            });
        }
        console.log("id: ", user._id);

        //create token with 1 day expiration
        const token = jwt.sign({
            id: user[0]._id,
            email: user[0].email,
            role: user[0].role
        }, process.env.JWT_SECRET, {
            expiresIn: '1d'
        });
        
        const loggedUser = {
            ...user[0]._doc,
            token: token
        };
        
        //delete password from user
        delete loggedUser.password;

        console.log("loggedUser: ", loggedUser);

        res.status(200).send(loggedUser);
    }
    catch(err){
        console.log("Error: ", err);
        res.status(500).send(err);
    }
}

exports.getUsers = getUsers;
exports.getUserById = getUserById;
exports.deleteUser = deleteUser;
exports.createUser = createUser;
exports.login = login;

