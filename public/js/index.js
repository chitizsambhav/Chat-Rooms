const socket = io()

const roomTitleTemplate = document.querySelector('#room-title-template').innerHTML
const customRoom = document.querySelector('#custom-room')
const $roomList = document.querySelector('#room-list')
socket.on('availableRooms', (availableRooms)=>{
    const availableRoomsObj = []
    let uniqueArray = [...new Set(availableRooms)];
    for (let index = 0; index < uniqueArray.length; index++) {
        availableRoomsObj.push({room:uniqueArray[index]})
    }
    console.log("Available Rooms:", availableRoomsObj);
    const html = Mustache.render(roomTitleTemplate,{
        availableRooms:availableRoomsObj
    })
    console.log("Rendered HTML:", html);
    $roomList.innerHTML = html
})

function jsFunction(){
   
    var selectElement = document.querySelector('#room-list')
    console.log(selectElement.value)
    if (selectElement.value !== 'default'){
        console.log(customRoom)
        customRoom.style.display = "none"
    }
    else{
        customRoom.style.display = "block"
    }
    
}