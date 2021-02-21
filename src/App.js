import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import axios from 'axios';

import '../src/util.js';
import Header from './components/Header/Header';
import Modal from './components/Modal/Modal';
import Backdrop from './components/Backdrop/Backdrop';
import AuthPage from './pages/Auth/Auth';
import DoctorAppointmentHomePage from './pages/DoctorAppointmentHome/DoctorAppointmentHome';
import BookNewAppointmentPage from './pages/BookNewAppointment/BookNewAppointment';
import DoctorRegistrationPage from './pages/DoctorRegistration/DoctorRegistration';
import DoctorDashboardPage from './pages/DoctorDashboard/DoctorDashboard';
import PatientDashboardPage from './pages/PatientDashboard/PatientDashboard';
import DoctorPage from './pages/Doctor/Doctor';
import DoctorsPage from './pages/Doctor/Doctors';
import EditDoctorPage from './pages/Doctor/EditDoctor';
import DoctorCardPage from './pages/DoctorCard/DoctorCard';
import DoctorCardsPage from './pages/DoctorCard/DoctorCards';
import BookAppointmentDoctorCardPage from './pages/DoctorCard/BookAppointmentDoctorCard';
import BookAppointmentForPage from './pages/BookAppointmentFor/BookAppointmentFor';
import PatientAppointmentsPage from './pages/PatientAppointment/PatientAppointments';
import PatientAppointmentPage from './pages/PatientAppointment/PatientAppointment';
import EditPatientAppointmentPage from './pages/PatientAppointment/EditPatientAppointment';

class App extends Component {
  state = {
    isAuth: true,
    authMode: 'login',
    error: null,
    success: null
  };

  logoutHandler = () => {
    this.setState({ isAuth: false });
  };

  authHandler = (event, authData) => {
    event.preventDefault();
    if (authData.email.trim() === '' || authData.password.trim() === '') {
      return;
    }
    let request;
    if (this.state.authMode === 'login') {
      request = axios.post('http://localhost:3100/login', authData);
    } else {
      request = axios.post('http://localhost:3100/signup', authData);
    }
    request
      .then(authResponse => {
        if (authResponse.status === 201 || authResponse.status === 200) {
          const token = authResponse.data.token;
          console.log(token);
          // Theoretically, you would now store the token in localstorage + app state
          // and use it for subsequent requests to protected backend resources
          this.setState({ isAuth: true });
        }
      })
      .catch(err => {
        this.errorHandler(err.response.data.message);
        console.log(err);
        this.setState({ isAuth: false });
      });
  };

  authModeChangedHandler = () => {
    this.setState(prevState => {
      return {
        authMode: prevState.authMode === 'login' ? 'signup' : 'login'
      };
    });
  };

  errorHandler = message => {
    this.setState({
      error: message
    });
  };

  successHandler = message => {
    this.setState({
      success: message
    });
  }

  render() {
    let routes = (
      <Switch>
        <Redirect from="/" to="/home" exact />
        {/* <Redirect from="/home"to="/doctor/add" exact />
        <Redirect from="/home"to="/patients" exact /> */}
        <Redirect from="/auth" to="/doctors" exact />
        <Redirect from="/signup" to="/doctors" exact />
        <Route
          path="/home"
          render={props => (
            <DoctorAppointmentHomePage {...props} onError={this.errorHandler} onSuccess={this.successHandler} />
          )}
        />
        <Route
          path="/doctordashboard"
          render={props => (
            <DoctorDashboardPage {...props} onError={this.errorHandler} onSuccess={this.successHandler} />
          )}
        />
        <Route
          path="/doctor/:mode"
          render={props => (
            <DoctorRegistrationPage {...props} onError={this.errorHandler} onSuccess={this.successHandler} />
          )}
        />
        <Route
          path="/doctors/:id/:mode"
          render={props => (
            <EditDoctorPage {...props} onError={this.errorHandler} onSuccess={this.successHandler} />
          )}
        />
        <Route
          path="/doctors/:id"
          render={props => (
            <DoctorPage {...props} onError={this.errorHandler} onSuccess={this.successHandler} />
          )}
        />
        {/* <Route
          path="/searchdoctors/specialization/:specialization/workingDays/:workingDays"
          render={props => (
            <DoctorsPage {...props} onError={this.errorHandler} onSuccess={this.successHandler} />
          )}
        /> */}
        <Route
          path="/searchdoctors"
          render={props => (
            <DoctorsPage {...props} onError={this.errorHandler} onSuccess={this.successHandler} />
          )}
        />
        <Route
          path="/doctors"
          render={props => (
            <DoctorsPage {...props} onError={this.errorHandler} onSuccess={this.successHandler} />
          )}
        />
        {/* <Route
          path="/patients/:patientPhone"
          render={props => (
            <PatientAppointmentsPage {...props} onError={this.errorHandler} onSuccess={this.successHandler} />
          )}
        /> */}
        <Route
          path="/patients"
          render={props => (
            <PatientDashboardPage {...props} onError={this.errorHandler} onSuccess={this.successHandler} />
          )}
        />
        <Route
          path="/appointment/doctordetails/"
          render={props => (
            <DoctorDashboardPage {...props} onError={this.errorHandler} onSuccess={this.successHandler} />
          )}
        />
        <Route
          path="/appointment/patientdetails/"
          render={props => (
            <DoctorDashboardPage {...props} onError={this.errorHandler} onSuccess={this.successHandler} />
          )}
        />
        <Route
          path="/appointment/datetime/"
          render={props => (
            <PatientDashboardPage {...props} onError={this.errorHandler} onSuccess={this.successHandler} />
          )}
        />
        <Route
          path="/appointment/book/:id"
          render={props => (
            <BookAppointmentForPage {...props} onError={this.errorHandler} onSuccess={this.successHandler} />
          )}
        />
        <Route
          path="/appointment/patient/:patientPhone"
          render={props => (
            <PatientAppointmentsPage {...props} onError={this.errorHandler} onSuccess={this.successHandler} />
          )}
        />
        <Route
          path="/appointments/:id/:mode"
          render={props => (
            <EditPatientAppointmentPage {...props} onError={this.errorHandler} onSuccess={this.successHandler} />
          )}
        />
        <Route
          path="/appointment/:id"
          render={props => (
            <PatientAppointmentsPage {...props} onError={this.errorHandler} onSuccess={this.successHandler} />
          )}
        />
        <Route
          path="/appointments/:id"
          render={props => (
            <PatientAppointmentPage {...props} onError={this.errorHandler} onSuccess={this.successHandler} />
          )}
        />
        <Route
          path="/appointments"
          render={props => (
            <PatientAppointmentsPage {...props} onError={this.errorHandler} onSuccess={this.successHandler} />
          )}
        />
        <Route
          path="/appointment"
          render={props => (
            <BookNewAppointmentPage {...props} onError={this.errorHandler} onSuccess={this.successHandler} />
          )}
        />
        {/* <Route
          path="/errorlog"
          render={props => (
            <PatientDashboardPage {...props} onError={this.errorHandler} onSuccess={this.successHandler} />
          )}
        /> */}
      </Switch>
    );

    if (!this.state.isAuth) {
      routes = (
        <Switch>
          <Redirect from="/" to="/auth" exact />
          <Redirect from="/home" to="/auth" exact />
          <Redirect from="/doctors" to="/auth" />
          <Redirect from="/doctor" to="/auth" />
          <Redirect from="/patients" to="/auth" />
          <Redirect from="/patient" to="/auth" />
          <Redirect from="/appointment" to="/auth" />
          <Redirect from="/appointment/book" to="/auth" />
          <Redirect from="/doctor/add" to="/auth" />
          <Route
            path="/auth"
            render={() => (
              <AuthPage
                mode={this.state.authMode}
                onAuth={this.authHandler}
                onAuthModeChange={this.authModeChangedHandler}
              />
            )}
          />
        </Switch>
      );
    }

    return (
      <div className="App">
        <Modal
          open={!!this.state.error}
          title="An Error Occurred"
          onClose={() => this.errorHandler(null)}
        >
          <p>{this.state.error}</p>
        </Modal>
        <Modal
          open={!!this.state.success}
          title="Attempt Successful"
          onClose={() => this.successHandler(null)}
        >
          <p>{this.state.success}</p>
        </Modal>
        <Backdrop show={!!this.state.error || !!this.state.success} />
        <Header
          authenticated={this.state.isAuth}
          onLogout={this.logoutHandler}
        />
        {routes}
      </div>
    );
  }
}

export default App;
