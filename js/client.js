const socket = io('http://localhost:4000');

// Get DOM element in respective Js variables
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector(".container");

//Audio that will play on receiving messages
var audio = new Audio('ting.wav');




//Function which will append event info to the container
const append = (name,message, position)=>{
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    let markup = `
        <h4>${name}</h4>
        <p>${message}</p>
    `
    messageElement.innerHTML = markup
    messageContainer.append(messageElement);
   

    if(position == 'left' || position == 'middle'){
        audio.play();
    }
    
    
}

// Ask new user for his/her name and let the server know
let name;
do{
    name = prompt("Enter your name to join: ");
}while(!name)

socket.emit('new-user-joined',name);




// If new user joins, receive the event from the server
socket.on('user-joined', name=>{
append('',`${name} joined the chat`,`middle`)
}); 

// If server sends a message receive it
socket.on('receive', data=>{
    
    append(data.name,`\n${data.message}`,`left`)
    
    }) 

// If a user leaves a chat append the info to the container    
socket.on('left', name=>{
    append('',`${name} left the chat`,`middle`)
    })  
    
// If the form gets submitted, send server the message    
form.addEventListener('submit',(e)=>{
    e.preventDefault();
    const message = messageInput.value;
    name = "you";
    append(`${name}`, `${message}`, `right`);
    socket.emit('send', message);
    messageInput.value = ''
})    

//to store data in database
// var mongoose = require("mongoose");
// var bodyParser = require('body-parser');
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended:true}));
// mongoose.Promise = global.Promise;
// mongoose.connect("mongodb://localhost:4000/messages")

// var nameSchema = new mongoose.SchemaType({
//     message: String
// });
// var User = mongoose.model("User",nameSchema);
// app.post("/addname", (req,res)=>{
//     var myData = new User(req.body);
//     myData.save()
//     .then(item => {
//       res.send("item saved to database");
//     })
//     .catch(err => {
//       res.status(400).send("unable to save to database");
//     });

// });