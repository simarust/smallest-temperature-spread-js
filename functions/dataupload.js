const functions = require('firebase-functions')
const admin = require('firebase-admin')
const cors = require('cors')({origin: true})

exports.dataupload = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    if (req.method !== 'POST') {
      return res.send(500, 'Invalid request')
    }

    if (!req.body.year || !req.body.month || !req.body.data) {
      return res.send(500, 'Invalid input data')
    }

    const year = req.body.year
    const month = req.body.month

    const data_lines = req.body.data.split('\n')

    const regex = /^\s*(\d+)\s+(\d+)\**\s+(\d+)\**/

    let counter = 0

    for (let line of data_lines) {
      const match = regex.exec(line)
      if (match !== null) {
        const day = match[1]

        const ref = admin.database().ref(`/data/${year}/${month}/${day}`)
        ref.set({
          maxTemp: match[2],
          minTemp: match[3]
        })

        counter++
      }
    }

    return res.status(200).json({
      year,
      month,
      counter
    })
  })
})
