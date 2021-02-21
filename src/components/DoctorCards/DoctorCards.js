import React from 'react';

import DoctorCard from './DoctorCard/DoctorCard';

import './DoctorCards.css';

const doctorCards = props => (
  <section className="doctorCards">
    {props.doctors.map(p => (
      <DoctorCard
        key={p._id}
        id={p._id}
        name={p.name}
        specialization={p.specialization}
        totalExperience={p.totalExperience}
        address={p.address}
        // onDelete={props.onDeleteProduct}
      />
    ))}
  </section>
);

export default doctorCards;