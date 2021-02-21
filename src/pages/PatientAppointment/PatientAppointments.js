import React, { Component } from 'react';
import axios from 'axios';

import PatientAppointments from '../../components/PatientAppointments/PatientAppointments';

class PatientAppointmentsPage extends Component {
  state = { isLoading: true, appointments: [] };
  componentDidMount() {
    this.fetchData();
  }

  appointmentDeleteHandler = patientPhone => {
    axios
      .delete('http://localhost:3100/appointment/' + patientPhone)
      .then(result => {
        console.log(result);
        this.fetchData();
      })
      .catch(err => {
        this.props.onError(
          'Cancelling the appointment failed. Please try again later'
        );
        console.log(err);
      });
  };

  fetchData = () => {
    let request;
    if (this.props.match.params.mode === 'patient') {
      request = axios.get(
        'http://localhost:3100/appointment/' + this.props.match.params.patientPhone);
    } else {
      request = axios.get('http://localhost:3100/appointment');
    }
    request
      .then(appointmentsResponse => {
        this.setState({ isLoading: false, appointments: appointmentsResponse.data });
      })
      .catch(err => {
        this.setState({ isLoading: false, appointments: [] });
        this.props.onError('Loading appointments failed. Please try again later');
        console.log(err);
      });
  };

  render() {
    let content = <p>Loading appointments...</p>;

    if (!this.state.isLoading && this.state.appointments.length > 0) {
      content = (
        <PatientAppointments
          appointments={this.state.appointments}
          onDeleteAppointment={this.appointmentDeleteHandler}
        />
      );
    }
    if (!this.state.isLoading && this.state.appointments.length === 0) {
      content = <p>Found no appointments. Try again later.</p>;
    }
    return <main>{content}</main>;
  }
}

export default PatientAppointmentsPage;