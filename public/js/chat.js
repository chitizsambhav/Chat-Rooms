

const socket = io()

let {selectedRoom, username, room} = Qs.parse(location.search, {ignoreQueryPrefix: true})
const $messageForm = document.querySelector('#message-form')
const $messageInputForm = $messageForm.querySelector('input')
const $messageButtonForm = $messageForm.querySelector('button')
const $message  = document.querySelector('#message')
const $chat_window = document.querySelector('.chat-window')
const $main = document.querySelector('.main')
const $container = document.querySelector('.container')
const message_template = document.querySelector('#message-template').innerHTML
const location_template = document.querySelector('#location-template').innerHTML
const sidebar_template = document.querySelector('#sidebar-template').innerHTML

if (selectedRoom !== 'default'){
    room = selectedRoom 
}

const autoscroll = (messageFrom)=>{

        if ((Math.ceil($container.scrollTop) + $container.offsetHeight -31 >= $message.scrollHeight)){
            $container.scrollTop = $message.scrollHeight
        }
        if(messageFrom.toLowerCase()===username.toLowerCase()){
            $container.scrollTop = $message.scrollHeight
        }

}

socket.on('message', (message)=>{
    const html = Mustache.render(message_template,{
        username:message.username,
        message:message.text,
        createdAt: moment(message.createdAt).format('hh:mm A')
    })
    $message.insertAdjacentHTML("beforeend", html)
    autoscroll(message.username)
})


socket.on('locationMessage', (locationURL)=>{
    const html = Mustache.render(location_template,{
            username:locationURL.username,
            locationURL:locationURL.locationURL,
            createdAt: moment(locationURL.createdAt).format('hh:mm A')
    })
    $message.insertAdjacentHTML("beforeend", html)
    autoscroll(locationURL.username)
})

socket.on('roomData', ({room, users})=>{
    const html = Mustache.render(sidebar_template,{
        room:room,
        users:users
    })
    document.querySelector('#sidebar').innerHTML = html
})
var shiftEnterCheck = 0

function newLine(event){
    if (event.shiftKey && event.key === "Enter") {
        shiftEnterCheck = 1
    }
    else{
        shiftEnterCheck = 0
    }
}

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = e.target.elements.message.value.trim(); // Trim the message
    if (message !== "") {
       
            $messageButtonForm.setAttribute('disabled', 'disabled'); // Disable the form button
            socket.emit('sendMessage', message, (message) => { 
            $messageButtonForm.removeAttribute('disabled');
            $messageInputForm.value = ''; 
            $messageInputForm.focus();
            console.log("Message delivered!");
        });
        }
        
     else {
        console.log("Empty message. Not sending.");
    }
});

const $sendLocationButton = document.querySelector('#sendLocation')

$sendLocationButton.addEventListener('click', (e)=>{
    $sendLocationButton.setAttribute('disabled', 'disabled')
    otor.geolocation.getCurrentPosition((position)=>{
       const coords = {latitude:position.coords.latitude, longitude:position.coords.longitude}
       socket.emit('sendLocation', coords, ()=>{
        // socket.emit('message', generateMessage('Location sent'))
        $sendLocationButton.removeAttribute('disabled')
       })
    })
})



socket.emit('join', {username, room}, (error)=>{
    if (error){
        alert(error)
        location.href = '/'
    }
})


