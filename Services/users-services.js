const bcrypt = require('bcryptjs')

const saltRounds = 12

class UserService {
 
    // these should be async

    static hashPass(password) {
        console.log(password)
        return new Promise((resolve, reject) => {
            bcrypt.genSalt(saltRounds, function (err, salt) {
                if (err) {
                    return reject(err)
                }
                bcrypt.hash(password, salt , function (err, hash) {
                    if (err) {
                        return reject(err)
                    }
                    console.log(hash)
                    resolve(hash)
                });
            });
        })

    }

    static checkPass(password, hash) {
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, hash, function (err, res) {
                if (err) {
                    return reject(err)
                }
                resolve(res)
            });
        })

    }

    

}

module.exports = UserService
