export const socketServer = io => {
  let userList = new Map()
  io.on('connection', socket => {
    socket.on('join', e => {
      userList.set(socket.id, e)
      socket.emit('joined', Object.assign({}, e, { id: socket.id }))
      const uList = [...userList.entries()]
      socket.broadcast.emit('welcome', {
        ...e,
        uList
      })
      socket.emit('welcome', {
        ...e,
        uList
      })
    })

    socket.on('send', e => {
      socket.broadcast.emit('message', e)
    })

    socket.on('send-user', e => {
      const sendUserId = e.sendUserId
      socket.to(sendUserId).emit('message-user', e)
    })

    socket.on('disconnecting', () => {
      const bool = userList.delete(socket.id)
      // 如果有用户离开，在进行广播（因为只打开页面不进入关闭页面也会触发这个事件）
      bool && socket.broadcast.emit('quit', socket.id)
    })
  })
}
