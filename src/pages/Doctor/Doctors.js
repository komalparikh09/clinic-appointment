import React, { Component } from 'react';
import axios from 'axios';

import Doctors from '../../components/Doctors/Doctors';
import { config } from 'process';

class DoctorsPage extends Component {
  state = { isLoading: true, doctors: [] };
  componentDidMount() {
    this.fetchData();
  }

  doctorDeleteHandler = doctorId => {
    axios
      .delete('http://localhost:3100/doctors/' + doctorId)
      .then(result => {
        console.log(result);
        this.fetchData();
      })
      .catch(err => {
        this.props.onError(
          'Deleting the doctor account failed. Please try again later'
        );
        console.log(err);
      });
  };

  fetchData = () => {
    axios
      .get('http://localhost:3100/doctors')
      .then(doctorsResponse => {
        this.setState({ isLoading: false, doctors: doctorsResponse.data });
      })
      .catch(err => {
        this.setState({ isLoading: false, doctors: [] });
        this.props.onError('Loading doctor accounts failed. Please try again later');
        console.log(err);
      });
  };

  searchDoctorHandler = () => {
    axios
      .get('http://localhost:3100/searchdoctors')
      .then(doctorsResponse => {
        this.setState({ isLoading: false, doctors: doctorsResponse.data });
      })
      .catch(err => {
        this.setState({ isLoading: false, doctors: [] });
        this.props.onError('Search failed. Please try again later');
        console.log(err);
      });
  };

  render() {
    let content = <p>Loading doctor accounts...</p>;

    if (!this.state.isLoading && this.state.doctors.length > 0) {
      content = (
        <Doctors
          doctors={this.state.doctors}
          onDeleteDoctor={this.doctorDeleteHandler}
        />
      );
    }
    if (!this.state.isLoading && this.state.doctors.length === 0) {
      content = <p>Found no doctor accounts. Try again later.</p>;
    }
    return <main>{content}</main>;
  }
}

export default DoctorsPage;