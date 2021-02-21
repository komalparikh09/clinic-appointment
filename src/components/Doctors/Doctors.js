import React from 'react';

import Doctor from './Doctor/Doctor';

import './Doctors.css';

const doctors = props => (
  <section className="doctors">
    {props.doctors.map(p => (
      <Doctor
        key={p._id}
        id={p._id}
        name={p.name}
        phoneNumber={p.phoneNumber}
        specialization={p.specialization}
        totalExperience={p.totalExperience}
        workingDays={p.workingDays}
        visitingHoursFrom={p.visitingHoursFrom}
        visitingHoursTo={p.visitingHoursTo}
        onDelete={props.onDeleteDoctor}
      />
    ))}
  </section>
);

export default doctors;