import React, { Component } from 'react';
import axios from 'axios';

import DoctorCards from '../../components/DoctorCards/DoctorCards';

class DoctorCardsPage extends Component {
  state = { isLoading: true, doctors: [] };
  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {
    axios
      .get('http://localhost:3100/searchdoctors')
      .then(doctorsResponse => {
        this.setState({ isLoading: false, doctors: doctorsResponse.data });
      })
      .catch(err => {
        this.setState({ isLoading: false, doctors: [] });
        this.props.onError('Loading search results for doctors failed. Please try again later');
        console.log(err);
      });
  };

  render() {
    let content = <p>Loading doctor accounts...</p>;

    if (!this.state.isLoading && this.state.doctors.length > 0) {
      content = (
        <DoctorCards
          doctors={this.state.doctors}
          // onDeleteDoctor={this.doctorDeleteHandler}
        />
      );
    }
    if (!this.state.isLoading && this.state.doctors.length === 0) {
      content = <p>Found no doctor accounts. Try again later.</p>;
    }
    return <main>{content}</main>;
  }
}

export default DoctorCardsPage;