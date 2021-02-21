import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import './PatientAppointment.css';

const patientAppointment = props => (
  <article className="patient-appointment">
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
          <h3>Patient Name : {props.patientName}</h3>
        </div>
      </div>
      <div className="doctor-card-text">
        <br />
        Doctor Name : Dr. {props.name}
        <br />
        <br />
        Doctor Phone Number : {props.phoneNumber}
        <br />
        <br />
        Doctor Specialization : {props.specialization}
        <br />
        <br />
        Doctor Total Experience : {props.totalExperience} years
        <br />
        <br />
        Doctor Working Days : {props.workingDays}
        <br />
        <br />
        Appointment Date : {props.appointmentDate} {props.appointmentTime}
        <br />
        <br />
        Patient Age : {props.patientAge}
        <br />
        <br />
        Patient Gender : {props.patientGender}
        <br />
        <br />
        Patient Problem : {props.patientProblem}
        <br />
      </div>
    </div>
    <div className="doctor-person__controls">
      <Link to={'/appointments/' + props.id}>Details</Link>
      <Link to={'/appointments/' + props.id + '/edit'}>Edit Appointment</Link>
      <button onClick={props.onDelete.bind(this, props.id)}>Cancel Appointment</button>
    </div>
  </article>
);

export default patientAppointment;