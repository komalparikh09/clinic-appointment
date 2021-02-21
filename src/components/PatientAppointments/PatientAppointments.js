import React from 'react';

import PatientAppointment from './PatientAppointment/PatientAppointment';

import './PatientAppointments.css';

const appointments = props => (
  <section className="patientAppointments">
    {props.appointments.map(p => (
      <PatientAppointment
        key={p._id}
        id={p._id}
        name={p.name}
        phoneNumber={p.phoneNumber}
        specialization={p.specialization}
        totalExperience={p.totalExperience}
        workingDays={p.workingDays}
        visitingHoursFrom={p.visitingHoursFrom}
        visitingHoursTo={p.visitingHoursTo}
        patientName={p.patientName}
        patientPhone={p.patientPhone}
        patientAge={p.patientAge}
        patientGender={p.patientGender}
        patientProblem={p.patientProblem}
        appointmentDate={p.appointmentDate}
        appointmentTime={p.appointmentTime}
        onDelete={props.onDeleteAppointment}
      />
    ))}
  </section>
);

export default appointments;