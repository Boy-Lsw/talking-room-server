import { Server } from 'socket.io'
import { socketServer } from './socket.js'
const io = new Server(5432, { cors: true })
socketServer(io)
