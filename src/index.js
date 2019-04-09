const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const apiURI = require('./constants/ApiURI')
const {apiWrapper, apiAuthWrapper} = require('./util/ApiUtil')
const {session, account, profile, transaction} = require('./controllers')

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

app.post(apiURI.PROFILE, async (req,res) => await apiAuthWrapper(req, res, profile.create))
app.get(apiURI.PROFILE, async (req,res) => await apiAuthWrapper(req, res, profile.getAll))
app.get(apiURI.PROFILE + apiURI.PARAM_ID, async (req,res) => await apiAuthWrapper(req, res, profile.getOne))
app.put(apiURI.PROFILE + apiURI.PARAM_ID, async (req,res) => await apiAuthWrapper(req, res, profile.update))
app.delete(apiURI.PROFILE + apiURI.PARAM_ID, async (req,res) => await apiAuthWrapper(req, res, profile.delete))

app.post(apiURI.TRANSACTION, async (req,res) => await apiAuthWrapper(req, res, transaction.create))
app.get(apiURI.TRANSACTION, async (req,res) => await apiAuthWrapper(req, res, transaction.getAll))
app.get(apiURI.TRANSACTION + apiURI.PARAM_SECOND_ID, async (req,res) => await apiAuthWrapper(req, res, transaction.getOne))
app.put(apiURI.TRANSACTION + apiURI.PARAM_SECOND_ID, async (req,res) => await apiAuthWrapper(req, res, transaction.update))
app.delete(apiURI.TRANSACTION + apiURI.PARAM_SECOND_ID, async (req,res) => await apiAuthWrapper(req, res, transaction.delete))

app.get('*', (req,res) => res.sendFile(path.join(__dirname+'/../ui/index.html')))

app.listen(PORT, () => console.log(`Listening on ${ PORT } with index path: ` + path.join(__dirname+'/../ui/index.html')))
