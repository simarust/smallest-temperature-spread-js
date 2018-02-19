import React, { Component } from 'react'

import { BrowserRouter, Switch, Route, Link } from 'react-router-dom'

import PropTypes from 'prop-types'
import classNames from 'classnames'

import { withStyles } from 'material-ui/styles'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import IconButton from 'material-ui/IconButton'
import Typography from 'material-ui/Typography'
import Drawer from 'material-ui/Drawer'
import Divider from 'material-ui/Divider'
import List from 'material-ui/List'
import { ListItem, ListItemIcon, ListItemText } from 'material-ui/List'
import MenuIcon from 'material-ui-icons/Menu'

import ChevronLeftIcon from 'material-ui-icons/ChevronLeft'
import FileUpload from 'material-ui-icons/FileUpload'
import InsertChart from 'material-ui-icons/InsertChart'

import DataUpload from './components/DataUpload'
import DataAnalyses from './components/DataAnalyses'

class App extends Component {
  state = {
    open: false
  }

  handleDrawerOpen = () => {
    this.setState({ open: true })
  }

  handleDrawerClose = () => {
    this.setState({ open: false })
  }

  render() {
    const { classes } = this.props

    return (
      <BrowserRouter>
        <div className={classes.root}>
          <div className={classes.appFrame}>
            <AppBar className={classNames(classes.appBar, this.state.open && classes.appBarShift)}>
              <Toolbar className={classes.toolbar} disableGutters={!this.state.open}>
                <IconButton color="inherit" aria-label="open drawer" onClick={this.handleDrawerOpen}
                  className={classNames(classes.menuButton, this.state.open && classes.hide)}>
                  <MenuIcon />
                </IconButton>
                <Typography variant="title" color="inherit" noWrap>
                  Weather Analyses
                </Typography>
              </Toolbar>
            </AppBar>
            <Drawer variant="permanent" open={this.state.open} classes={{
              paper: classNames(classes.drawerPaper, !this.state.open && classes.drawerPaperClose)
            }}>
              <div className={classes.drawerInner}>
                <div className={classes.drawerHeader}>
                  <IconButton onClick={this.handleDrawerClose}>
                    <ChevronLeftIcon />
                  </IconButton>
                </div>
                <Divider />
                  <List>
                    <ListItem component={Link} to="/upload" button>
                      <ListItemIcon>
                        <FileUpload />
                      </ListItemIcon>
                      <ListItemText primary="Data Upload" />
                    </ListItem>
                    <ListItem component={Link} to="/analyses" button>
                      <ListItemIcon>
                        <InsertChart />
                      </ListItemIcon>
                      <ListItemText primary="Data Analyses" />
                    </ListItem>
                  </List>
              </div>
            </Drawer>
            <main className={classes.content}>
              <Switch>
                <Route exact path='/' component={DataUpload} />
                <Route path='/upload' component={DataUpload} />
                <Route path='/analyses' component={DataAnalyses} />
              </Switch>
            </main>
          </div>
        </div>
      </BrowserRouter>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
}

const drawerWidth = 240

const styles = theme => ({
  root: {
    width: '100%',
    height: '100%',
    zIndex: 1,
    overflow: 'hidden'
  },
  appFrame: {
    position: 'relative',
    display: 'flex',
    width: '100%',
    height: '100%'
  },
  appBar: {
    position: 'absolute',
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 36,
    backgroundColor: 'rgba(0, 0, 0, 0.25)'
  },
  hide: {
    display: 'none'
  },
  toolbar: {
    height: '100%',
    backgroundImage: "url('weather.png')",
    backgroundSize: 'auto 100%',
    backgroundColor: '#4fc0e7',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right'
  },
  drawerPaper: {
    position: 'relative',
    height: '100%',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    })
  },
  drawerPaperClose: {
    width: 60,
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    })
  },
  drawerInner: {
    // Make the items inside not wrap when transitioning:
    width: drawerWidth
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar
  },
  content: {
    width: 100% - 61,
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: 24,
    height: 'calc(100% - 56px)',
    marginTop: 56,
    [theme.breakpoints.up('sm')]: {
      height: 'calc(100% - 64px)',
      marginTop: 64,
    }
  }
})

export default withStyles(styles, { withTheme: true })(App)
