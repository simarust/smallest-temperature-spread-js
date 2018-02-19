import React, { Component } from 'react'
import PropTypes from 'prop-types'

import axios from 'axios'

import { withStyles } from 'material-ui/styles'
import Grid from 'material-ui/Grid'
import Typography from 'material-ui/Typography'
import { FormControl } from 'material-ui/Form'
import { InputLabel } from 'material-ui/Input'
import Select from 'material-ui/Select'
import { MenuItem } from 'material-ui/Menu'
import Button from 'material-ui/Button'
import Snackbar from 'material-ui/Snackbar'

class DataUpload extends Component {
  constructor(props){
    super(props)

    this.state = {
      month: '',
      year: '',
      uploading: false,
      snackbarOpen: false,
      snackbarText: ''
    }
  }

  fileUpload = null
  uploadDataUrl = 'https://us-central1-weather-analyses.cloudfunctions.net/dataupload'

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  setUploading = (uploading) => {
    this.setState({
      uploading
    })
  }

  setSnackbar = (snackbarOpen, snackbarText) => {
    this.setState({
      snackbarOpen,
      snackbarText
    })
  }

  createYearsArray() {
    const firstSupportedYear = 1970
    var currentYear = new Date().getFullYear()
    // creates an array with years starting from current year
    // down to the first supported Year
    return Array(currentYear - firstSupportedYear + 1)
      .fill()
      .map((x, i) => i + firstSupportedYear)
      .reverse()
  }

  onFileSelected = (event) => {
    this.setUploading(true)
    const file = event.target.files[0]
    if (file) {
      let fileContent
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        fileContent = e.target.result
        this.uploadFileContent(fileContent)
      }
      fileReader.readAsText(file)
    }
  }

  uploadFileContent = (content) => {
    const body = {
      "year": this.state.year,
      "month": this.state.month,
      "data": content
    }
    axios.post(this.uploadDataUrl, body)
      .then((response) => {
        this.setUploading(false)
        const message = 'Uploaded ' + response.data.counter + ' lines of data to the database.'
        this.setSnackbar(true, message)
        this.setState({
          year: '',
          month: ''
        })
      })
      .catch((error) => {
        this.setUploading(false)
        const message = 'An error occured while uploading the data file. Please try again.'
        this.setSnackbar(true, message)
        console.log('error: ' + error)
      })
  }

  render() {
    const { classes } = this.props

    const years = this.createYearsArray()
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ]

    return (
      <form className={classes.root} autoComplete="off">
        <Grid container spacing={0}>
          <Grid item xs={12} sm={12} md={7}>
            <FormControl className={classes.formControl}>
              <Typography variant='title' align='center'>
              Please select the year and month for which you want to upload weather data. Then click on the button to select a weather data file.
              </Typography>
            </FormControl>
          </Grid>
          <Grid item md={5} />
          <Grid item xs={12} sm={5} md={3}>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="year">Year</InputLabel>
              <Select value={this.state.year}
                      onChange={this.handleChange}
                      inputProps={{ name: 'year', id: 'year' }}>
                <MenuItem value=""></MenuItem>
                { years.map((item, index) => {
                  return (
                    <MenuItem value={item} key={index}>{item}</MenuItem>
                  )
                }) }
              </Select>
            </FormControl>
          </Grid>
          <Grid item sm={1} />
          <Grid item xs={12} sm={5} md={3}>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="month">Month</InputLabel>
              <Select value={this.state.month}
                      onChange={this.handleChange}
                      inputProps={{ name: 'month', id: 'month' }}>
                <MenuItem value=""></MenuItem>
                { months.map((item, index) => {
                  return (
                    <MenuItem value={index + 1} key={index}>{item}</MenuItem>
                  )
                }) }
              </Select>
            </FormControl>
          </Grid>
          <Grid item md={5} />
          <Grid item xs={12} sm={11} md={7}>
            <FormControl className={classes.formControl}>
              <Button variant='raised'
                      className={classes.button}
                      disabled={!this.state.year || !this.state.month || this.state.uploading}
                      onClick={() => this.fileUpload.click()}>
                { this.state.uploading ? 'Uploading...' : 'Upload weather data' }
              </Button>
              <input className={classes.hidden}
                     type='file'
                     ref={(fileUpload) => {this.fileUpload = fileUpload}}
                     onChange={this.onFileSelected} />
            </FormControl>
          </Grid>
        </Grid>
        <Snackbar open={this.state.snackbarOpen}
                  autoHideDuration={5000}
                  onClose={() => this.setSnackbar(false, '')}
                  message={this.state.snackbarText} />
      </form>
    )
  }
}

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
    width: '100%'
  },
  button: {
    margin: theme.spacing.unit,
    backgroundColor: '#4fc0e7',
    color: 'white',
    fontWeight: 'bold'
  },
  hidden: {
    visibility: 'hidden'
  }
})

DataUpload.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(DataUpload)
