const bcrypt = require('bcryptjs')

const saltRounds = 12

class UserService {
 
    // these should be async

    static hashPass(password) {
        return new Promise((resolve, reject) => {
            bcrypt.genSalt(saltRounds, function (err, salt) {
                if (err) {
                    return reject(err)
                }
                bcrypt.hash(password, salt, null, function (err, hash) {
                    if (err) {
                        return reject(err)
                    }
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
