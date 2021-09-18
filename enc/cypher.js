const dotenv = require('dotenv');
dotenv.config();
// import native crypto module to handle password encryption and decryption
const crypto = require('crypto')
    // generate 16 bytes of random data
    //const initVector = crypto.randomBytes(16)
    // secret key generate 32 bytes of random data
    //const securityKey = crypto.randomBytes(32)


module.exports = {
    //Encryption function that handles encrypting the given password
    encrypt: function(pwd) {
        // cipher variable containing all initialized variables
        const cipher = crypto.createCipheriv(
                process.env.ALG,
                Buffer.from(process.env.KEY),
                Buffer.from(process.env.PASSWD)
            )
            // encryption process
        console.log(`given password: ${pwd}`)
            //process of encryption is done here with the specified algorithm, initialized initvector,key and stored in in this variable
        let encrypted = cipher.update(pwd, 'utf-8', 'hex')
            // variable containing encrypted form of message given to encryption process
        encrypted += cipher.final('hex')
        console.log(`encrypted pass : ${encrypted}`)
            //return the encrypted password as a function return
        return encrypted
    },
    //decryption function that handles decrypting the password retrieved frm database
    decrypt: function(pwd) {
        // decipher variable containing required data to be decrypted
        const decipher = crypto.createDecipheriv(
                process.env.ALG,
                Buffer.from(process.env.KEY),
                Buffer.from(process.env.PASSWD)
            )
            // variable containing decrypted form of message
        let decrypted = decipher.update(pwd, 'hex', 'utf-8')
        decrypted += decipher.final('utf8')
            //return the decrypted password as function return
        return decrypted
    }
}