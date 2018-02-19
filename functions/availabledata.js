const functions = require('firebase-functions')
const admin = require('firebase-admin')
const cors = require('cors')({origin: true})

exports.availabledata = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    if (req.method !== 'GET') {
      return res.send(500, 'Invalid request')
    }

    const reference = 'data'

    return admin.database().ref(reference)
      .once('value')
      .then(snapshot => {
        var values = snapshot.val()
        let availabledata = {}
        for (let year in values) {
          availabledata[year] = []
          for (let month in values[year]) {
            availabledata[year].push(month)
          }
        }
        return res.status(200).json({
          availabledata
        })
      })
      .catch(error => {
        return res.status(500).json({error})
      })
  })
})
