const functions = require('firebase-functions')
const admin = require('firebase-admin')
const cors = require('cors')({origin: true})

exports.analyzedata = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    if (req.method !== 'POST') {
      return res.send(500, 'Invalid request')
    }

    if (!req.body.year || !req.body.month) {
      return res.send(500, 'Invalid input data')
    }

    const year = req.body.year
    const month = req.body.month

    const ref = admin.database().ref(`data/${year}/${month}`)
    return ref.once('value')
    .then(snapshot => {
      const values = snapshot.toJSON()
      let valuesArray = []
      for (let day in values) {
        const data = values[day]
        valuesArray.push({
          day,
          data,
          spread: data.maxTemp - data.minTemp
        })
      }
      const sortedArray = valuesArray.sort((a, b) => a.spread - b.spread)
      const minSpread = sortedArray[0]
      const maxSpread = sortedArray[sortedArray.length - 1]
      return res.status(200).json({
        minSpreadDay: minSpread.day,
        maxSpreadDay: maxSpread.day,
        values
      })
    })
    .catch(error => {
      return res.status(500).json(error.message)
    })
  })
})
