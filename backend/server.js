const express = require('express')
const connectDB = require('./config/db')
const path = require('path')

const app = express()

const cors=require("cors");
const corsOptions ={
   origin:'*', 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}

app.use(cors(corsOptions)) // Use this after the variable declaration

// Connect Database
connectDB()

// Init Middleware
app.use(express.json({ extended: false }))

// Define Routes
app.use('/api/users', require('./routes/api/users'))
app.use('/api/auth', require('./routes/api/auth'))
app.use('/api/profile', require('./routes/api/profile'))
app.use('/api/appointments', require('./routes/api/appointments'))
app.use('/api/chat', require('./routes/api/chat'))

app.get('/', (req, res) => {
    res.send("App is running")
})

const PORT = process.env.PORT || 5000

const server = app.listen(PORT, () => console.log(`Server started on port ${PORT}`))

const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://127.0.0.1/",
    }
})

io.on("connection", (socket) => {
    console.log("Connected to socket.io")
    socket.on("setup", (userData) => {
        socket.join(userData.id)
        console.log(userData.id)
        socket.emit("connected")
    })

    socket.on("join chat", (room) => {
        socket.join(room)
        console.log("User Joined Room: " + room)
    })
    socket.on("typing", (room) => socket.in(room).emit("typing"))
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"))

    socket.on("new message", (newMessageReceived) => {
        var chat = newMessageReceived
        var message = newMessageReceived.message
        var newmessage = message[message.length - 1]
        // if (!chat.users) return console.log("chat.users not defined")
        console.log('emits')
        // chat.users.forEach((user) => {
            socket.in(chat.student).emit("message received", chat, newmessage)
            socket.in(chat.teacher).emit("message received", chat, newmessage)
        // })
    })

    socket.off("setup", () => {
        console.log("USER DISCONNECTED")
        socket.leave(userData)
    })
})