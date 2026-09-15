const mongoose =  require('mongoose');
require('dotenv').config();

const url = `mongodb+srv://${process.env.DB_USER_NAME}:${process.env.DB_PASSWORD}@${process.env.DB_APP_NAME}.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

// console.log(url)

mongoose.connect(url)
.then(() => {
    console.log('Connected to MongoDB');
  
})
.catch((error) => console.log(error));
