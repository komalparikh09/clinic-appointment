import React from 'react';
import { Link } from 'react-router-dom';

import './DoctorCard.css';

const doctor = props => (
  <article className="doctor-person">
    {/* <div
      className="doctor-person__image"
      style={{ backgroundImage: "url('" + props.imageUrl + "')" }}
    /> */}
    <div className="doctor-card">
      <div className="doctor-card-name">
        <div className="doctor-card-text">
          <h3>Dr. {props.name}</h3>
        </div>
      </div>
      <div className="doctor-card-text">
        <br />
          Specialization : {props.specialization}
        <br />
        <br />
          Total Experience : {props.totalExperience} years
          <br />
        <br />
          Address : HealthShades Clinic
        <br />
      </div>
      <div className="buttonRight">
        <Link to={'/appointment/book/' + props.id}><input type="submit" id="btnBookAppointment" className="blueBtn"
          value="Book Appointment" /></Link>
      </div>
    </div>
    {/* <div className="doctor-person__controls">
      <Link to={'/appointment/book/' + props.id}>Book Appointment</Link>
    </div> */}
  </article>
);

export default doctor;