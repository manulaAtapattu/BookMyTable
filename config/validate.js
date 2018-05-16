
    function validateRegister(user) {
        if (user.name == undefined || user.username == undefined || user.email == undefined || user.password == undefined || user.confPass == undefined || user.userType == undefined) {
            return false;
        } else {
            return true;
        }
    }

exports.validateRegister=validateRegister();