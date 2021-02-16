//our username 
var name; 
var connectedUser;
  
//connecting to our signaling server 
var conn = new WebSocket('ws://localhost:9090');
  
conn.onopen = function () { 
   console.log("Connected to the signaling server"); 
};
  
//when we got a message from a signaling server 
conn.onmessage = function (msg) { 
   console.log("Got message", msg.data);
	
   var data = JSON.parse(msg.data);
	
   switch(data.type) { 
      case "login": 
         handleLogin(data.success);
         break; 
      //when somebody wants to call us 
      case "offer": 
         handleOffer(data.offer, data.name); 
         break; 
      case "answer": 
         handleAnswer(data.answer); 
         break; 
      //when a remote peer sends an ice candidate to us 
      case "candidate": 
         handleCandidate(data.candidate); 
         break; 
      case "leave": 
         handleLeave(); 
         break; 
      default: 
         break; 
   } 
};
  
conn.onerror = function (err) { 
   console.log("Got error", err); 
};
  
//alias for sending JSON encoded messages 
function send(message) { 
   //attach the other peer username to our messages 
   if (connectedUser) { 
      message.name = connectedUser; 
   } 
	
   conn.send(JSON.stringify(message)); 
};

//****** 
//UI selectors block 
//****** 

var loginPage = document.querySelector('#loginPage'); 
var usernameInput = document.querySelector('#usernameInput'); 
var loginBtn = document.querySelector('#loginBtn'); 

var callPage = document.querySelector('#callPage'); 
var callToUsernameInput = document.querySelector('#callToUsernameInput');
var callBtn = document.querySelector('#callBtn'); 

var hangUpBtn = document.querySelector('#hangUpBtn');
  
//hide call page 
callPage.style.display = "none"; 
 
// Login when the user clicks the button 
loginBtn.addEventListener("click", function (event) { 
   name = usernameInput.value; 
	
   if (name.length > 0) { 
      send({ 
         type: "login", 
         name: name 
      }); 
   } 
	
});
 
function handleLogin(success) { 

   if (success === false) { 
      alert("Ooops...try a different username"); 
   } else { 
      //display the call page if login is successful 
      loginPage.style.display = "none"; 
      callPage.style.display = "block";  
      //start peer connection 
   } 
};