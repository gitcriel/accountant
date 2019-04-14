const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const apiURI = require('./common/constants/ApiURI')
const {apiWrapper, apiAuthWrapper} = require('./common/util/ApiUtil')
const session = require('./session/SessionController')
const account = require('./account/AccountController')
const profile = require('./profile/ProfileController')
const transaction = require('./transaction/TransactionController')
const category = require('./category/CategoryController')
const institution = require('./institution/InstitutionController')

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

app.post(apiURI.PROFILES, async (req,res) => await apiAuthWrapper(req, res, profile.create))
app.get(apiURI.PROFILES, async (req,res) => await apiAuthWrapper(req, res, profile.getAll))
app.get(apiURI.PROFILE, async (req,res) => await apiAuthWrapper(req, res, profile.getOne))
app.put(apiURI.PROFILE, async (req,res) => await apiAuthWrapper(req, res, profile.update))
app.delete(apiURI.PROFILE, async (req,res) => await apiAuthWrapper(req, res, profile.delete))

app.post(apiURI.TRANSACTIONS, async (req,res) => await apiAuthWrapper(req, res, transaction.create))
app.get(apiURI.TRANSACTIONS, async (req,res) => await apiAuthWrapper(req, res, transaction.getAll))
app.get(apiURI.TRANSACTION, async (req,res) => await apiAuthWrapper(req, res, transaction.getOne))
app.put(apiURI.TRANSACTION, async (req,res) => await apiAuthWrapper(req, res, transaction.update))
app.delete(apiURI.TRANSACTION, async (req,res) => await apiAuthWrapper(req, res, transaction.delete))

app.post(apiURI.CATEGORIES, async (req,res) => await apiAuthWrapper(req, res, category.create))
app.get(apiURI.CATEGORIES, async (req,res) => await apiAuthWrapper(req, res, category.getAll))
app.get(apiURI.CATEGORY, async (req,res) => await apiAuthWrapper(req, res, category.getOne))
app.put(apiURI.CATEGORY, async (req,res) => await apiAuthWrapper(req, res, category.update))
app.delete(apiURI.CATEGORY, async (req,res) => await apiAuthWrapper(req, res, category.delete))

app.post(apiURI.INSTITUTIONS, async (req,res) => await apiAuthWrapper(req, res, institution.create))
app.get(apiURI.INSTITUTIONS, async (req,res) => await apiAuthWrapper(req, res, institution.getAll))
app.get(apiURI.INSTITUTION, async (req,res) => await apiAuthWrapper(req, res, institution.getOne))
app.put(apiURI.INSTITUTION, async (req,res) => await apiAuthWrapper(req, res, institution.update))
app.delete(apiURI.INSTITUTION, async (req,res) => await apiAuthWrapper(req, res, institution.delete))

app.get('*', (req,res) => res.sendFile(path.join(__dirname+'/../ui/index.html')))

app.listen(PORT, () => console.log(`Listening on ${ PORT } with index path: ` + path.join(__dirname+'/../ui/index.html')))
