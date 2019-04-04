const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const apiURI = require('./constants/ApiURI')
const {apiWrapper, apiAuthWrapper} = require('./util/ApiUtil')
const {session, account} = require('./controllers')

const PORT = process.env.PORT || 5000

var app = express()
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, '/../ui')))

startRecurringFunctions()

function startRecurringFunctions() {
  setInterval(session.clearExpiredSessions, 900000)
}

app.post(apiURI.SESSION, async (req,res) => await apiWrapper(req, res, session.createSession))
app.delete(apiURI.SESSION, async (req,res) => await apiAuthWrapper(req, res, session.destroySession))

app.post(apiURI.ACCOUNT_CHANGE_PASSWORD, async (req,res) => await apiAuthWrapper(req, res, account.changePassword))
app.post(apiURI.ACCOUNT, async (req,res) => await apiWrapper(req, res, account.createAccount))

app.get('*', (req,res) => res.sendFile(path.join(__dirname+'/../ui/index.html')))

app.listen(PORT, () => console.log(`Listening on ${ PORT } with index path: ` + path.join(__dirname+'/../ui/index.html')))
