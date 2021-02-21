import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

import './EditPatientAppointment.css';
import '../../../src/elements.css';
import '../../../src/util.js';
// import Input from '../../components/Input/Input';
// import Button from '../../components/Button/Button';
// import $ from 'jquery';

class EditPatientAppointmentPage extends Component {
  state = {
    isLoading: true,
    appointment: new Object(),
    allAppointments: [],
    hasCurrentAppointment: false,
    id: '',
    doctorId: '',
    name: '',
    phoneNumber: '',
    specialization: '',
    totalExperience: '',
    workingDays: '',
    patientName: '',
    patientPhone: '',
    patientAge: '',
    patientGender: '',
    patientProblem: '',
    appointmentDate: '',
    appointmentTime: ''
  };

  componentDidMount() {
    axios
      .get('http://localhost:3100/appointment/' + this.props.match.params.id)
      .then(appointmentResponse => {
        //console.log(appointmentResponse);
        this.setState({
          isLoading: false,
          appointment: appointmentResponse.data,
          id: appointmentResponse.data._id,
          doctorId: appointmentResponse.data.doctorId,
          name: appointmentResponse.data.name,
          phoneNumber: appointmentResponse.data.phoneNumber,
          specialization: appointmentResponse.data.specialization,
          totalExperience: appointmentResponse.data.totalExperience,
          workingDays: appointmentResponse.data.workingDays,
          patientName: appointmentResponse.data.patientName,
          patientPhone: appointmentResponse.data.patientPhone,
          patientAge: appointmentResponse.data.patientAge,
          patientGender: appointmentResponse.data.patientGender,
          patientProblem: appointmentResponse.data.patientProblem,
          appointmentDate: appointmentResponse.data.appointmentDate,
          appointmentTime: appointmentResponse.data.appointmentTime
        });
        document.getElementById('doctorName').innerHTML = this.state.name;
        document.getElementById('patientName').value = this.state.patientName;
        document.getElementById('patientPhone').value = this.state.patientPhone;
        document.getElementById('patientAge').value = this.state.patientAge;
        document.getElementById('patientGender').value = this.state.patientGender;
        document.getElementById('patientProblem').value = this.state.patientProblem;
        document.getElementById('appointmentDate').value = this.state.appointmentDate;
        document.getElementById('appointmentTime').value = this.state.appointmentTime;
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
        this.props.onError('Loading the appointment details failed. Please try again later');
      });
  }

  inputChangeHandler = (event, input) => {
    this.setState({ [input]: event.target.value });
  };

  validateFormValues = () => {
    if (this.state.patientName.length === 0 || this.state.patientGender.length === 0 || this.state.patientProblem.length === 0 || this.state.patientAge.length === 0 || this.state.patientPhone.length === 0 || this.state.appointmentDate.length === 0 || this.state.appointmentTime.length === 0) {
      throw "Please fill all the required values before submitting.";
    }
    else {
      if (this.state.patientAge.length > 3 && this.state.patientAge > 130) {
        throw "Please enter a valid age.";
      }
      if (this.state.patientPhone.length !== 10) {
        throw "Please enter a valid phone number.";
      }
      if (this.state.appointmentDate.length !== 10) {
        throw "Please enter a valid appointment date in mm/dd/yyyy format."
      }
      const now = new Date();
      var appointmentDateTime = this.state.appointmentDate + " " + this.state.appointmentTime.replaceAll('.','');
      var appointmentDateTimeM = new Date(Date.parse(appointmentDateTime));
      if (now > appointmentDateTimeM) {
        throw "You cannot book an appointment for a past date. Please enter today's date or a future date for an appointment."
      }
    }
  }

  validateOverlapAppointmentDoctor = (doctorId, appointmentDate, appointmentTime, appointmentData) => {
    if (appointmentDate.trim() !== '' && appointmentTime.trim() !== '') {
      var appointmentDateBooked = new Date(appointmentDate);
      let request;
      request = axios.get('http://localhost:3100/appointment/datetime/', { params: { doctorId: doctorId, appointmentDate: appointmentDate, appointmentTime: appointmentTime } });
      request
        .then(result => {
          this.setState({ isLoading: false, allAppointments: result.data, hasCurrentAppointment: false });
          document.getElementById('doctorName').innerHTML = this.state.name;
          document.getElementById('patientName').value = this.state.patientName;
          document.getElementById('patientPhone').value = this.state.patientPhone;
          document.getElementById('patientAge').value = this.state.patientAge;
          document.getElementById('patientGender').value = this.state.patientGender;
          document.getElementById('patientProblem').value = this.state.patientProblem;
          document.getElementById('appointmentDate').value = this.state.appointmentDate;
          document.getElementById('appointmentTime').value = this.state.appointmentTime;
          if (this.state.allAppointments.length > 0) {
            this.state.allAppointments.map((appointment, index) => {
              if (appointment._id !== this.state.id) {
                if ((appointment.appointmentDate !== null || appointment.appointmentDate !== '') && (appointment.appointmentTime !== null || appointment.appointmentTime !== '')) {
                  const appointmentDateM = new Date(appointment.appointmentDate);
                  if (appointmentDateBooked.getTime() === appointmentDateM.getTime()) {
                    if (appointmentTime === appointment.appointmentTime) {
                      this.setState({ hasCurrentAppointment: true });
                    }
                  }
                }
              }
            });
          }
          if (this.state.hasCurrentAppointment === true) {
            throw "Appointment cannot be booked due to unavailability of time slots for the doctor. Please select another slot and try again.";
          }
          else {
            this.validateOverlapAppointmentPatient(this.state.patientPhone, appointmentDate, appointmentTime, appointmentData);
          }
        })
        .catch(err => {
          this.setState({ isLoading: false });
          this.props.onError(err);
        });
    }
  }
  validateOverlapAppointmentPatient = (patientPhone, appointmentDate, appointmentTime, appointmentData) => {
    if (appointmentDate.trim() !== '' && appointmentTime.trim() !== '') {
      var appointmentDateBooked = new Date(appointmentDate);
      let request;
      request = axios.get('http://localhost:3100/appointment/' + 'patient/' + patientPhone);
      request
        .then(result => {
          this.setState({ isLoading: false, allAppointments: result.data, hasCurrentAppointment: false });
          document.getElementById('doctorName').innerHTML = this.state.name;
          document.getElementById('patientName').value = this.state.patientName;
          document.getElementById('patientPhone').value = this.state.patientPhone;
          document.getElementById('patientAge').value = this.state.patientAge;
          document.getElementById('patientGender').value = this.state.patientGender;
          document.getElementById('patientProblem').value = this.state.patientProblem;
          document.getElementById('appointmentDate').value = this.state.appointmentDate;
          document.getElementById('appointmentTime').value = this.state.appointmentTime;
          if (this.state.allAppointments.length > 0) {
            this.state.allAppointments.map((appointment, index) => {
              if (appointment._id !== this.state.id) {
                if ((appointment.appointmentDate !== null || appointment.appointmentDate !== '') && (appointment.appointmentTime !== null || appointment.appointmentTime !== '')) {
                  const appointmentDateM = new Date(appointment.appointmentDate);
                  if (appointmentDateBooked.getTime() === appointmentDateM.getTime()) {
                    if (appointmentTime === appointment.appointmentTime) {
                      this.setState({ hasCurrentAppointment: true });
                    }
                  }
                }
              }
            });
          }
          if (this.state.hasCurrentAppointment === true) {
            throw "Appointment cannot be booked because you already have an existing appointment in the chosen time slot. Please select another slot and try again.";
          }
          else {
            const appointmentData = {
              doctorId: this.state.doctorId,
              name: this.state.name,
              phoneNumber: this.state.phoneNumber,
              specialization: this.state.specialization,
              totalExperience: this.state.totalExperience,
              workingDays: this.state.workingDays,
              patientName: this.state.patientName,
              patientPhone: this.state.patientPhone,
              patientAge: this.state.patientAge,
              patientGender: this.state.patientGender,
              patientProblem: this.state.patientProblem,
              appointmentDate: this.state.appointmentDate,
              appointmentTime: this.state.appointmentTime,
            };
            let request;
            if (this.props.match.params.mode === 'edit') {
              request = axios.patch(
                'http://localhost:3100/appointment/' + this.props.match.params.id, appointmentData);
            } else {
              request = axios.post('http://localhost:3100/appointment', appointmentData);
            }
            request
              .then(result => {
                this.setState({ isLoading: false });
                this.props.onSuccess(result.data.message);
                // this.props.history.replace('/appointments');
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
                  'Appointment booking failed. Please try again later'
                );
              });
          }
        })
        .catch(err => {
          this.setState({ isLoading: false });
          this.props.onError(err);
        });
    }
  };

  updateAppointmentPatient = event => {
    event.preventDefault();
    try {
      this.validateFormValues();
    }
    catch (err) {
      this.setState({ isLoading: false });
      this.props.onError(err);
      return;
    }
    this.setState({ isLoading: true });
    const appointmentData = {
      doctorId: this.state.doctorId,
      name: this.state.name,
      phoneNumber: this.state.phoneNumber,
      specialization: this.state.specialization,
      totalExperience: this.state.totalExperience,
      workingDays: this.state.workingDays,
      patientName: this.state.patientName,
      patientPhone: this.state.patientPhone,
      patientAge: this.state.patientAge,
      patientGender: this.state.patientGender,
      patientProblem: this.state.patientProblem,
      appointmentDate: this.state.appointmentDate,
      appointmentTime: this.state.appointmentTime,
    };
    this.validateOverlapAppointmentDoctor(this.state.doctorId, this.state.appointmentDate, this.state.appointmentTime, appointmentData);
  };

  resetValues = event => {
    this.setState({ name: '' });
    this.setState({ phoneNumber: '' });
    this.setState({ specialization: '' });
    this.setState({ totalExperience: '' });
    this.setState({ workingDays: '' });
    this.setState({ patientName: '' });
    this.setState({ patientPhone: '' });
    this.setState({ patientAge: '' });
    this.setState({ patientGender: '' });
    this.setState({ patientProblem: '' });
    this.setState({ appointmentDate: '' });
    this.setState({ appointmentTime: '' });
    let request;
    request = axios.get('http://localhost:3100/home');
    request
      .then(result => {
        this.setState({ isLoading: false });
        this.props.history.replace('/home');
      })
      .catch(err => {
        this.setState({ isLoading: false });
        console.log(err);
        this.props.onError(
          'Resetting the appointment details failed. Please try again later'
        );
      });
  };

  render() {
    let content = (
      <div>
        <form className="book-appointment__form" onSubmit={this.bookAppointmentPatient}>
          <br />
          <span style={{ fontSize: "28px" }}>
            <b>Book Appointment for Dr. <span id="doctorName"></span>
              {/* <input id="doctorName" className="textInput" /> */}
            </b>
          </span>
          <br />
          <br />
          <table border="1" width="90%" style={{ borderCollapse: "collapse" }}>
            <colgroup>
              <col width="100%" />
            </colgroup>
            <tbody>
              <tr>
                <td style={{ textAlign: "center" }}>
                  <table border="0" width="100%" style={{ borderCollapse: "collapse" }} cellSpacing="10" cellPadding="5">
                    <colgroup>
                      <col width="49%" />
                      <col width="65%" />
                    </colgroup>
                    <tbody>
                      <tr>
                        <td>
                          <br />
                        </td>
                        <td>
                          <br />
                        </td>
                      </tr>
                      <tr>
                        <td style={{ textAlign: "center" }}>
                          <table border="0" cellSpacing="5" cellPadding="5" width="100%">
                            <colgroup>
                              <col width="30%" />
                              <col width="70%" />
                            </colgroup>
                            <tbody>
                              <tr>
                                <td className="formFirstCol">
                                  Patient Name :
                                </td>
                                <td style={{ textAlign: "left" }}>
                                  <input type="text" className="textInput" id="patientName" placeholder="Enter name of the patient"
                                    onChange={event => this.inputChangeHandler(event, 'patientName')} />
                                </td>
                              </tr>
                              <tr>
                                <td className="formFirstCol">
                                  Patient Gender :
                                </td>
                                <td style={{ textAlign: "left" }}>
                                  <select id="patientGender" className="textInput"
                                    onChange={event => this.inputChangeHandler(event, 'patientGender')}>
                                    <option value="" disabled selected hidden>--Select--</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                  </select>
                                </td>
                              </tr>
                              <tr>
                                <td className="formFirstCol">
                                  Patient Problem :
                                </td>
                                <td style={{ textAlign: "left" }}>
                                  <input type="text" className="textInput" id="patientProblem" placeholder="Describe problem of the patient"
                                    onChange={event => this.inputChangeHandler(event, 'patientProblem')} />
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                        <td style={{ textAlign: "center" }}>
                          <table border="0" cellSpacing="1" cellPadding="1" width="100%">
                            <colgroup>
                              <col width="30%" />
                              <col width="70%" />
                            </colgroup>
                            <tbody>
                              <tr>
                                <td className="formFirstCol">
                                  Patient Age :
                                </td>
                                <td style={{ textAlign: "left" }}>
                                  <input type="text" className="textInput" id="patientAge" placeholder="Enter age of the patient"
                                    onChange={event => this.inputChangeHandler(event, 'patientAge')} />
                                </td>
                              </tr>
                              <tr>
                                <td className="formFirstCol">
                                  Phone Number :
                                </td>
                                <td style={{ textAlign: "left" }}>
                                  <input type="text" className="textInput" id="patientPhone" placeholder="Enter valid phone number"
                                    onChange={event => this.inputChangeHandler(event, 'patientPhone')} />
                                </td>
                              </tr>
                              <tr>
                                <td className="formFirstCol">
                                  Appointment Date :
                                </td>
                                <td style={{ textAlign: "left" }}>
                                  <input type="text" className="textInput" id="appointmentDate" placeholder="mm/dd/yyyy"
                                    onChange={event => this.inputChangeHandler(event, 'appointmentDate')} />
                                </td>
                              </tr>
                              <tr>
                                <td className="formFirstCol">
                                  Appointment Time :
                                </td>
                                <td style={{ textAlign: "left" }}>
                                  <select id="appointmentTime" className="textInput"
                                    onChange={event => this.inputChangeHandler(event, 'appointmentTime')}>
                                    <option value="" disabled selected hidden style={{ paddingLeft: "10px", color: "#D3D3D3" }}>Click to show timepicker</option>
                                    <option>12:00 A.M.</option>
                                    <option>12:30 A.M.</option>
                                    <option>01:00 A.M.</option>
                                    <option>01:30 A.M.</option>
                                    <option>02:00 A.M.</option>
                                    <option>02:30 A.M.</option>
                                    <option>03:00 A.M.</option>
                                    <option>03:30 A.M.</option>
                                    <option>04:00 A.M.</option>
                                    <option>04:30 A.M.</option>
                                    <option>05:00 A.M.</option>
                                    <option>05:30 A.M.</option>
                                    <option>06:00 A.M.</option>
                                    <option>06:30 A.M.</option>
                                    <option>07:00 A.M.</option>
                                    <option>07:30 A.M.</option>
                                    <option>08:00 A.M.</option>
                                    <option>08:30 A.M.</option>
                                    <option>09:00 A.M.</option>
                                    <option>09:30 A.M.</option>
                                    <option>10:00 A.M.</option>
                                    <option>10:30 A.M.</option>
                                    <option>11:00 A.M.</option>
                                    <option>11:30 A.M.</option>
                                    <option>12:00 P.M.</option>
                                    <option>12:30 P.M.</option>
                                    <option>01:00 P.M.</option>
                                    <option>01:30 P.M.</option>
                                    <option>02:00 P.M.</option>
                                    <option>02:30 P.M.</option>
                                    <option>03:00 P.M.</option>
                                    <option>03:30 P.M.</option>
                                    <option>04:00 P.M.</option>
                                    <option>04:30 P.M.</option>
                                    <option>05:00 P.M.</option>
                                    <option>05:30 P.M.</option>
                                    <option>06:00 P.M.</option>
                                    <option>06:30 P.M.</option>
                                    <option>07:00 P.M.</option>
                                    <option>07:30 P.M.</option>
                                    <option>08:00 P.M.</option>
                                    <option>08:30 P.M.</option>
                                    <option>09:00 P.M.</option>
                                    <option>09:30 P.M.</option>
                                    <option>10:00 P.M.</option>
                                    <option>10:30 P.M.</option>
                                    <option>11:00 P.M.</option>
                                    <option>11:30 P.M.</option>
                                  </select>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td style={{ textAlign: "right" }}>
                          <input type="submit" id="btnBookAppointment" className="blueBtn" value="Update Appointment"
                            onClick={this.updateAppointmentPatient} />
                        </td>
                        <td style={{ textAlign: "left" }}>
                          <input type="reset" id="btnCancel" className="blueBtn" value="Cancel" onClick={this.resetValues} />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
          <br />
          <br />
        </form>
      </div>
    );
    if (this.state.isLoading) {
      content = <p>Is loading...</p>;
    }
    return <main>{content}</main>;
  }
}

// function DoctorName(props) {
//   return (
//     <span>
//       {this.state.doctor.name}
//     </span>
//   );
// }

// var doctorName = (
//   <div>
//     <DoctorName name="Satish Kashyap" />
//   </div>
// );

//ReactDOM.render('doctorName', document.getElementById('doctorName'));

export default EditPatientAppointmentPage;