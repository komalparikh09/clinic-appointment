import React, { Component } from 'react';
import axios from 'axios';

import './DoctorAppointmentHome.css';
import '../../../src/elements.css';
import '../../../src/util.js';
// import Input from '../../components/Input/Input';
// import Button from '../../components/Button/Button';
// import $ from 'jquery';

class DoctorAppointmentHomePage extends Component {
  state = {
    isLoading: true,
    name: '',
    phoneNumber: '',
    specialization: '',
    totalExperience: '',
    workingDays: '',
    visitingHoursFrom: '',
    visitingHoursTo: ''
  };

  componentDidMount() {
    // Will be "edit" or "add"
    if (this.props.match.params.mode === 'edit') {
      axios
        .get('http://localhost:3100/doctors/' + this.props.match.params.id)
        .then(doctorResponse => {
          const doctor = doctorResponse.data;
          this.setState({
            isLoading: false,
            name: doctor.name,
            phoneNumber: doctor.phoneNumber,
            specialization: doctor.specialization,
            totalExperience: doctor.totalExperience,
            workingDays: doctor.workingDays,
            visitingHoursFrom: doctor.visitingHoursFrom,
            visitingHoursTo: doctor.visitingHoursTo
          });
        })
        .catch(err => {
          this.setState({ isLoading: false });
          console.log(err);
        });
    } else {
      this.setState({ isLoading: false });
    }
  }

  inputChangeHandler = (event, input) => {
    this.setState({ [input]: event.target.value });
  };

  navigateToDoctor = event => {
    this.setState({ isLoading: false });
    this.props.history.replace('/doctordashboard');
    // let request;
    // request = axios.get('http://localhost:3100/doctors');
    // request
    //   .then(result => {
    //     this.setState({ isLoading: false });
    //     this.props.history.replace('/doctors');
    //   })
    //   .catch(err => {
    //     this.setState({ isLoading: false });
    //     console.log(err);
    //     this.props.onError(
    //       'Navigating to the doctor details screen failed. Please try again later'
    //     );
    //   });
  };

  navigateToPatient = event => {
    let request;
    request = axios.get('http://localhost:3100/patients');
    request
      .then(result => {
        this.setState({ isLoading: false });
        this.props.history.replace('/patients');
      })
      .catch(err => {
        this.setState({ isLoading: false });
        //console.log(err);
        const errData = {
          message: err.message,
        };
        let err_request;
        err_request = axios.post('http://localhost:3100/errorlog', errData);
        err_request
          .then(err_result => {
            this.setState({ isLoading: false });
            this.props.onError(err_result.message);
            return;
          });
        this.props.onError(
          'Navigating to the patient details screen failed. Please try again later'
        );
      });
  };

  navigateToRegisterNewDoctor = event => {
    this.setState({ isLoading: false });
    this.props.history.replace('/doctor/add');
  };

  navigateToBookNewAppointment = event => {
    this.setState({ isLoading: false });
    this.props.history.replace('/appointment');
  };

  render() {
    let content = (
      <div>
        <form className="add-doctor__form">
          <h2>HealthShades Clinic Appointment</h2>
          <table border="1" width="90%" style={{ borderCollapse: "collapse" }} cellSpacing="5" cellPadding="5">
            <colgroup>
              <col width="100%" />
            </colgroup>
            <tbody>
              <tr>
                <td style={{ textAlign: "center" }}>
                  <table border="0" cellSpacing="0" cellPadding="0" width="100%">
                    <colgroup>
                      <col width="50%" />
                      <col width="50%" />
                    </colgroup>
                    <tbody>
                      <tr>
                        <td style={{ textAlign: "center" }}>
                          <input type="button" id="btnDoctor" className="greenBtn" value="Doctor" onClick={this.navigateToDoctor} />
                        </td>
                        <td style={{ textAlign: "center" }}>
                          <input type="button" id="btnPatient" className="greenBtn" value="Patient" onClick={this.navigateToPatient} />
                        </td>
                      </tr>
                      <tr>
                        <td colSpan="2">
                          <br />
                          <br />
                        </td>
                      </tr>
                      <tr>
                        <td style={{ textAlign: "center" }}>
                          <input type="button" id="btnDoctor" className="greenBtn" value="Register New Doctor" onClick={this.navigateToRegisterNewDoctor} />
                        </td>
                        <td style={{ textAlign: "center" }}>
                          <input type="button" id="btnPatient" className="greenBtn" value="Book New Appointment" onClick={this.navigateToBookNewAppointment} />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </form>
      </div>
    );
    if (this.state.isLoading) {
      content = <p>Is loading...</p>;
    }
    return <main>{content}</main>;
  }
}

export default DoctorAppointmentHomePage;