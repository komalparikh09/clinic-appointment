import React, { Component } from 'react';
import axios from 'axios';

import './DoctorCard.css';

class DoctorCardPage extends Component {
  state = { isLoading: true, doctor: null };

  componentDidMount() {
    axios
      .get('http://localhost:3100/searchdoctors/' + this.props.match.params.id)
      .then(doctorResponse => {
        this.setState({ isLoading: false, doctor: doctorResponse.data });
      })
      .catch(err => {
        this.setState({ isLoading: false });
        console.log(err);
        this.props.onError('Loading the doctor details failed. Please try again later');
      });
  }

  render() {
    let content = <p>Is loading...</p>;

    if (!this.state.isLoading && this.state.doctor) {
      content = (
        <main className="doctor-page">
          <h1>Name: {this.state.doctor.name}</h1>
          <h2>Phone Number: {this.state.doctor.phoneNumber}</h2>
          <h2>Specialization: {this.state.doctor.specialization}</h2>
          <p>Total Experience: {this.state.doctor.totalExperience}</p>
          <p>Working Days: {this.state.doctor.workingDays}</p>
          <p>Visiting Hours From: {this.state.doctor.visitingHoursFrom}</p>
          <p>Visiting Hours To: {this.state.doctor.visitingHoursTo}</p>
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
    if (!this.state.isLoading && !this.state.doctor) {
      content = (
        <main>
          <p>Found no doctor. Try again later.</p>
        </main>
      );
    }
    return content;
  }
}

export default DoctorCardPage;