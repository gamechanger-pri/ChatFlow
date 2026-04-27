const jwt = require("jsonwebtoken");

const generateToken=(id)=>{
    return jwt.sign({id}, "tushar", {
        expiresIn:"30d",
    });
};

module.exports = generateToken;