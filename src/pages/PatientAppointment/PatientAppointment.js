import React, { Component } from 'react';
import axios from 'axios';

import './PatientAppointment.css';

class PatientAppointmentPage extends Component {
  state = { isLoading: true, appointment: null };

  componentDidMount() {
    axios
      .get('http://localhost:3100/appointment/' + this.props.match.params.id)
      .then(appointmentResponse => {
        this.setState({ isLoading: false, appointment: appointmentResponse.data });
      })
      .catch(err => {
        this.setState({ isLoading: false });
        console.log(err);
        this.props.onError('Loading the appointment details failed. Please try again later');
      });
  }

  render() {
    let content = <p>Is loading...</p>;

    if (!this.state.isLoading && this.state.appointment) {
      content = (
        <main className="appointment-page">
          <br />
          <div className="doctor-card">
            <div className="doctor-card-name">
              <div className="doctor-card-text">
                <h3>Patient Name: {this.state.appointment.patientName}</h3>
              </div>
            </div>
            <div className="doctor-card-text">
              <br />
              Doctor Name: Dr. {this.state.appointment.name}
              <br />
              <br />
              Doctor Phone Number : {this.state.appointment.phoneNumber}
              <br />
              <br />
              Doctor Specialization : {this.state.appointment.specialization}
              <br />
              <br />
              Doctor Total Experience : {this.state.appointment.totalExperience} years
              <br />
              <br />
              Doctor Working Days : {this.state.appointment.workingDays}
              <br />
              <br />
              Appointment Date : {this.state.appointment.appointmentDate} {this.state.appointment.appointmentTime}
              <br />
              <br />
              Patient Age : {this.state.appointment.patientAge}
              <br />
              <br />
              Patient Gender : {this.state.appointment.patientGender}
              <br />
              <br />
              Patient Problem : {this.state.appointment.patientProblem}
              <br />
              <br />
            </div>
          </div>
          {/* <h1>Name: {this.state.doctor.name}</h1>
          <h2>Phone Number: {this.state.doctor.phoneNumber}</h2>
          <h2>Specialization: {this.state.doctor.specialization}</h2>
          <p>Total Experience: {this.state.doctor.totalExperience}</p>
          <p>Working Days: {this.state.doctor.workingDays}</p>
          <p>Visiting Hours From: {this.state.doctor.visitingHoursFrom}</p>
          <p>Visiting Hours To: {this.state.doctor.visitingHoursTo}</p> */}
          {/* <div
            className="doctor-page__image"
            style={{
              backgroundImage: "url('" + this.state.doctor.image + "')"
            }}
          /> }
          {/* <p>{this.state.doctor.description}</p> */}
        </main>
      );
    }
    if (!this.state.isLoading && !this.state.appointment) {
      content = (
        <main>
          <p>Found no appointment. Try again later.</p>
        </main>
      );
    }
    return content;
  }
}

export default PatientAppointmentPage;