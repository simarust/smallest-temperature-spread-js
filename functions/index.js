const functions = require('firebase-functions')
const admin = require('firebase-admin')
const { dataupload } = require('./dataupload')
const { availabledata } = require('./availabledata')
const { analyzedata } = require('./analyzedata')

admin.initializeApp(functions.config().firebase)

exports.dataupload = dataupload
exports.availabledata = availabledata
exports.analyzedata = analyzedata