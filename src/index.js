const express = require('express');
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage, generateLocationURL} = require('./utils/message')
const { getUser, getUserInRoom, removeUser, addUser, getRooms} = require('./utils/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = 3000

const publicDirectory = path.join(__dirname , '../public')
app.use(express.static(publicDirectory))

io.on('connection', (socket) =>{
    console.log("Someone Connected!")
    
    
    socket.on('join', ({username, room}, callback )=>{
        const { error, user }= addUser({id: socket.id, username, room})
        if(error){
            return callback(error)
        }
        socket.join(user.room)
        socket.emit('message', generateMessage('Welcome', 'Admin'))
        socket.broadcast.to(user.room).emit('message', generateMessage(`${user.username} has joined this group chat!!!`, 'Admin'))

        io.to(user.room).emit('roomData', {
            room:user.room,
            users:getUserInRoom({room:user.room})
        })
    })

    socket.on('sendMessage', (message, callback)=>{
        const user = getUser({id:socket.id})
        const filter = new Filter()
        if (filter.isProfane(message)){
            socket.emit('message', generateMessage('Profane Language is restricted in this chat-room'))
            return
        }
        io.to(user.room).emit('message', generateMessage(message, user.username))
        callback()
    })

    socket.on('sendLocation', async (coords, callback)=>{
        const user = getUser({id:socket.id})
        socket.broadcast.to(user.room).emit('locationMessage', generateLocationURL(`https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`, user.username))
        await callback()
        socket.emit('message', generateMessage('Location Sent', 'Admin'))
    })

    socket.on('disconnect', ()=>{
        const removedUser = removeUser({id:socket.id})
        if (removedUser){
            io.to(removedUser.room).emit('message', generateMessage( `${removedUser.username} has left the chat room!`,'Admin'))
            io.to(removedUser.room).emit('roomData', {
                room:removedUser.room,
                users:getUserInRoom({room:removedUser.room})
            })
        }
        
    })

    socket.emit('availableRooms', getRooms())

})

server.listen(port, ()=>{
    console.log("The server is up and running on: " + port)
})