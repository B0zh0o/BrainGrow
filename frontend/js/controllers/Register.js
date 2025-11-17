import User from "../../../backend/models/User.js";

class Register{
    constructor(){
        this.users = [];
    }

    registerUser(email, password, username){
        const user = new User(email, password, username);

        if(!this.userExists(user.email)){
        user.id = User.currentId;
        User.currentId++;
        this.users.push(user);
        console.log("User added.");

        }
        else{
            console.log("User already exists.");
        }
    }

    userExists(email){
        if(this.users.some(u => u.email === email)){
            return true;
        }
        return false;
    }
}

const register = new Register();
register.registerUser("test@example.com", "1234", "TestUser");
register.registerUser("tests@example.com", "2345", "TestUser");
register.registerUser("test@example.com", "1234", "TestUser");
console.log("All users:", register.users);
