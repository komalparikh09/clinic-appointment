import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import './Doctor.css';

// bookAppointment = event => {
//   let request;
//   request = axios.post('http://localhost:3100/appointment/book/', doctor);
//   request
//     .then(result => {
//       this.setState({ isLoading: false });
//       this.props.history.replace('/appointment');
//     })
//     .catch(err => {
//       this.setState({ isLoading: false });
//       console.log(err);
//       this.props.onError(
//         'Resetting the doctor details failed. Please try again later'
//       );
//     });
// }

const doctor = props => (
  <article className="doctor-person">
    {/* <div
      className="doctor-person__image"
      style={{ backgroundImage: "url('" + props.imageUrl + "')" }}
    /> */}
    {/* <div className="doctor-person__content">
      <h1>Name: {props.name}</h1>
      <h2>Phone Number: {props.phoneNumber}</h2>
      <h2>Specialization: {props.specialization}</h2>
      <h2>Total Experience: {props.totalExperience} years</h2>
      <h2>Working Days: {props.workingDays}</h2>
      <h2>Visiting Hours From: {props.visitingHoursFrom}</h2>
      <h2>Visiting Hours To: {props.visitingHoursTo}</h2>
      <div className="doctor-person__controls">
        <Link to={'/doctors/' + props.id}>Details</Link>
        <Link to={'/doctors/' + props.id + '/edit'}>Edit</Link>
        <button onClick={props.onDelete.bind(this, props.id)}>Delete</button>
      </div>
    </div> */}
    <div className="doctor-card">
      <div className="doctor-card-name">
        <div className="doctor-card-text">
          <h3>Dr. {props.name}</h3>
        </div>
      </div>
      <div className="doctor-card-text doctor-card-main">
        <br />
          Phone Number: {props.phoneNumber}
        <br />
        <br />
          Specialization: {props.specialization}
        <br />
        <br />
          Total Experience: {props.totalExperience} years
          <br />
        <br />
          Address: HealthShades Clinic
        <br />
        <br />
          Working Days: {props.workingDays}
        <br />
        <br />
          Visiting Hours From: {props.visitingHoursFrom}
        <br />
        <br />
          Visiting Hours To: {props.visitingHoursTo}
        <br />
      </div>
      <div className="buttonRight">
        <Link to={'/appointment/book/' + props.id}><input type="submit" id="btnBookAppointment" className="blueBtn"
          value="Book Appointment" /></Link>
      </div>
    </div>
    <div className="doctor-person__controls">
      {/* <Link to={'/appointment/book/' + props.id}>Book Appointment</Link> */}
      <Link to={'/doctors/' + props.id}>Details</Link>
      <Link to={'/doctors/' + props.id + '/edit'}>Edit</Link>
      <button onClick={props.onDelete.bind(this, props.id)}>Delete</button>
    </div>
  </article>
);

export default doctor;