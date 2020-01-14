const Express = require('express')
const app = Express()
const Routes = require('./routes')
app.use(Express.json())

const Port = process.env.PORT || 5000

app.use('/api/posts',Routes)

app.listen(Port,()=>console.log(`Server is running on Port: ${Port}`))