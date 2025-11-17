import sequelize from './db.js'
import User from "./models/User.js";


async function startApp(){
    try{
        sequelize.authenticate();
        console.log("Connection established successfully.");
        //other logic
    }
    catch(error){
        console.error("Problem with establishing connection.", error);
    }

    await sequelize.sync({alter: true});
    console.log("Database synced successfully.")
    const user1 = User.build({username: "Bozho", email: "someemail@gmail.com", password: "123456"});
    console.log(user1.username);
    await user1.save();
    console.log("User1 was added successfully!");
}

startApp();