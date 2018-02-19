import React, { Component } from 'react'
import PropTypes from 'prop-types'

import axios from 'axios'
import Chart from 'chart.js'

import { withStyles } from 'material-ui/styles'
import Grid from 'material-ui/Grid'
import Typography from 'material-ui/Typography'
import { FormControl } from 'material-ui/Form'
import { InputLabel } from 'material-ui/Input'
import Select from 'material-ui/Select'
import { MenuItem } from 'material-ui/Menu'
import Button from 'material-ui/Button'
import Paper from 'material-ui/Paper'
import Snackbar from 'material-ui/Snackbar'

class DataAnalyses extends Component {
  constructor(props) {
    super(props)

    this.state = {
      availableData: 'init',
      month: '',
      year: '',
      analysis: '',
      analyzing: false,
      snackbarOpen: false,
      snackbarText: '',
      analysisData: undefined
    }
  }

  availableDataUrl = 'https://us-central1-weather-analyses.cloudfunctions.net/availabledata'
  analyzeDataUrl = 'https://us-central1-weather-analyses.cloudfunctions.net/analyzedata'

  months = [
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

  componentWillMount() {
    axios.get(this.availableDataUrl)
      .then(response => {
        this.setState({availableData: response.data.availabledata})
      })
      .catch(error => {
        const message = 'An error occured while retrieving available data. Please try reloading the page.'
        this.setSnackbar(true, message)
        console.log(error)
      })
  }

  getDataAnalysis = () => {
    this.setAnalyzing(true)
    const body = {
      "year": this.state.year,
      "month": this.state.month
    }
    axios.post(this.analyzeDataUrl, body)
      .then(response => {
        const analysisData = response.data
        this.setState({ analysisData })
        this.setAnalyzing(false)
        this.drawChart()
      })
      .catch((error) => {
        this.setAnalyzing(false)
        const message = 'An error occured while retrieving analysis. Please try again.'
        this.setSnackbar(true, message)
        console.log('error: ' + error)
      })
  }

  drawChart = () => {
    const context = document.getElementById('chartContainer')

    const data = Object.values(this.state.analysisData.values)
    const days = Object.keys(this.state.analysisData.values)
    const maxTemp = data.map(d => d.maxTemp)
    const minTemp = data.map(d => d.minTemp)

    let config = {
      type: 'line',
        data: {
          labels: days,
          datasets: [{
            label: 'Highest temperature',
            data: maxTemp,
            borderWidth: 2,
            fill: false,
            backgroundColor: 'red',
            borderColor: 'red'
          },
          {
            label: 'Lowest temperature',
            data: minTemp,
            borderWidth: 2,
            fill: false,
            backgroundColor: 'blue',
            borderColor: 'blue'
          }
        ]
      },
      options: {
        responsive: true,
        title: {
          display: true,
          text: `${this.months[this.state.month - 1]} ${this.state.year}`
        },
        tooltips: {
          mode: 'index',
          intersect: false
        },
        hover: {
          mode: 'nearest',
          intersect: true
        },
        scales: {
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Day'
            }
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: '°F'
            },
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    }
  
    new Chart(context, config)
  }

  handleChange = event => {
    if (event.target.name === 'year') {
      this.setState({ month: '' })
    }

    this.setState({
      [event.target.name]: event.target.value
    })
  }

  setAnalyzing = (analyzing) => {
    this.setState({
      analyzing
    })
  }

  setSnackbar = (snackbarOpen, snackbarText) => {
    this.setState({
      snackbarOpen,
      snackbarText
    })
  }

  render() {
    const { classes } = this.props

    return (
      <form className={classes.root} autoComplete="off">
        <Grid container spacing={0}>
          <Grid item xs={12} sm={12} md={7}>
            <FormControl className={classes.formControl}>
              <Typography variant='title' align='center'>
                Please select the year and month for which you would like to perform an analysis.
                You can only select years and months for which data is available in the database.
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
                { Object.keys(this.state.availableData).reverse().map((year, index) => {
                  return (
                    <MenuItem value={year} key={index}>{year}</MenuItem>
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
                { this.state.availableData[this.state.year]
                  ? this.state.availableData[this.state.year].map((item, index) => {
                    return (
                      <MenuItem value={item} key={index}>{this.months[item - 1]}</MenuItem>
                    )
                  })
                  : ''
                }
              </Select>
            </FormControl>
          </Grid>
          <Grid item md={5} />
          <Grid item xs={12} md={7}>
            <FormControl className={classes.formControl}>
              <Button variant='raised'
                      className={classes.button}
                      disabled={!this.state.year || !this.state.month || this.state.analyzing}
                      onClick={this.getDataAnalysis}>
                { this.state.analyzing ? 'Analyzing...' : 'Analyze weather data' }
              </Button>
            </FormControl>
          </Grid>
          <Grid item md={5} />
          { this.state.analysisData && (
            <Grid item xs={12} md={7}>
              <Paper className={classes.paper}>
                <canvas id='chartContainer' className={classes.chartContainer} />
                Day with the minimal temperature spread: {this.state.analysisData.minSpreadDay}
                <br />
                Day with the maximal temperature spread: {this.state.analysisData.maxSpreadDay}
              </Paper>
            </Grid>
          ) }
        </Grid>
        <Snackbar open={this.state.snackbarOpen}
                  autoHideDuration={5000}
                  onClose={() => this.setSnackbar(false, '')}
                  message={this.state.snackbarText} />
      </form>
    );
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
  paper: {
    padding: theme.spacing.unit * 3,
    marginTop: theme.spacing.unit * 3
  },
  chartContainer: {
    width: 100% - theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 3
  }
})

DataAnalyses.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(DataAnalyses)
