import React, { Component } from 'react';
import axios from 'axios';

import './BookAppointmentDoctorCard.css';
import '../../../src/elements.css';
import '../../../src/util.js';
// import Input from '../../components/Input/Input';
// import Button from '../../components/Button/Button';
import $ from 'jquery';

//const $ = window.$;
var specializationArr = new Array(12);

class EditDoctorPage extends Component {
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

  editProductHandler = event => {
    event.preventDefault();
    if (
      this.state.name.trim() === '' ||
      this.state.phoneNumber.trim() === '' ||
      this.state.specialization.trim() === '' ||
      this.state.totalExperience.trim() === '' ||
      this.state.workingDays.trim() === '' ||
      this.state.visitingHoursFrom.trim() === '' ||
      this.state.visitingHoursTo.trim() === ''
    ) {
      return;
    }
    this.setState({ isLoading: true });
    const doctorData = {
      name: this.state.name,
      phoneNumber: this.state.phoneNumber,
      specialization: this.state.specializationArr,
      totalExperience: this.state.totalExperience,
      workingDays: this.state.workingDays,
      visitingHoursFrom: this.state.visitingHoursFrom,
      visitingHoursTo: this.state.visitingHoursTo
    };
    let request;
    if (this.props.match.params.mode === 'edit') {
      request = axios.patch(
        'http://localhost:3100/doctors/' + this.props.match.params.id,
        doctorData
      );
    } else {
      request = axios.post('http://localhost:3100/doctors', doctorData);
    }
    request
      .then(result => {
        this.setState({ isLoading: false });
        this.props.history.replace('/doctors');
      })
      .catch(err => {
        this.setState({ isLoading: false });
        console.log(err);
        this.props.onError(
          'Editing or registering the doctor account failed. Please try again later'
        );
      });
  };

  inputChangeHandler = (event, input) => {
    this.setState({ [input]: event.target.value });
  };

  selectDay = (event, btnId) => {
    var btnDay = document.getElementById(btnId);
    $(btnDay).toggleClass("daysBox daysBoxSelected");
  };

  addCheckboxValues = (event, specializationId) => {
    var specializationChkVal = document.getElementById(specializationId).value;
    for (var i = 0; i < specializationArr.length; i++) {
      if (specializationArr[i] === '') {
        specializationArr[i] = specializationChkVal;
        break;
      }
    }
  };

  addDoctorHandler = event => {
    event.preventDefault();
    // if (
    //   this.state.name.trim() === '' ||
    //   this.state.phoneNumber.trim() === '' ||
    //   this.state.specialization.trim() === '' ||
    //   this.state.totalExperience.trim() === '' ||
    //   this.state.workingDays.trim() === '' ||
    //   this.state.visitingHoursFrom.trim() === '' ||
    //   this.state.visitingHoursTo.trim() === ''
    // ) {
    //   return;
    // }
    this.setState({ isLoading: true });
    const doctorData = {
      name: this.state.name,
      phoneNumber: this.state.phoneNumber,
      specialization: this.state.specializationArr,
      totalExperience: this.state.totalExperience,
      workingDays: this.state.workingDays,
      visitingHoursFrom: this.state.visitingHoursFrom,
      visitingHoursTo: this.state.visitingHoursTo
    };
    let request;
    if (this.props.match.params.mode === 'edit') {
      request = axios.patch(
        'http://localhost:3100/doctors/' + this.props.match.params.id,
        doctorData
      );
    } else {
      request = axios.post('http://localhost:3100/doctors', doctorData);
    }
    request
      .then(result => {
        this.setState({ isLoading: false });
        this.props.history.replace('/doctors');
      })
      .catch(err => {
        this.setState({ isLoading: false });
        console.log(err);
        this.props.onError(
          'Editing or registering the doctor account failed. Please try again later'
        );
      });
  };

  render() {
    let content = (
      <div>
        <form className="add-doctor__form" onSubmit={this.addDoctorHandler}>
          <h2>Doctor Registration</h2>
          <table border="1" width="90%" style={{ borderCollapse: "collapse" }} cellSpacing="5" cellPadding="5">
            <colgroup>
              <col width="100%" />
            </colgroup>
            <tbody>
              <tr>
                <td style={{ textAlign: "center" }}>
                  <table border="0" cellSpacing="10" cellPadding="10" width="100%">
                    <colgroup>
                      <col width="30%" />
                      <col width="70%" />
                    </colgroup>
                    <tbody>
                      <tr>
                        <td className="formFirstCol">
                          Doctor Name :
                        </td>
                        <td style={{ textAlign: "left" }}>
                          <input type="text" className="textInput" id="doctorName"
                            placeholder="Enter name of the Doctor" onChange={event => this.inputChangeHandler(event, 'name')} />
                        </td>
                      </tr>
                      <tr>
                        <td className="formFirstCol">
                          Phone Number :
                        </td>
                        <td style={{ textAlign: "left" }}>
                          <input type="text" className="textInput" id="doctorPhone"
                            placeholder="Enter valid phone number" onChange={event => this.inputChangeHandler(event, 'phoneNumber')} />
                        </td>
                      </tr>
                      <tr>
                        <td className="formFirstCol">
                          Specialization :
                        </td>
                        <td style={{ textAlign: "left" }}>
                          <table border="0" cellSpacing="0" cellPadding="0" width="100%">
                            <colgroup>
                              <col width="30%" />
                              <col width="30%" />
                              <col width="40%" />
                            </colgroup>
                            <tbody>
                              <tr>
                                <td style={{ textAlign: "left" }}>
                                  <input type="checkbox" id="chkMbbs" name="specialization" value="MBBS"
                                    onClick={event => this.addSpecialization(event, 'chkMbbs')} />
                                  <label for="chkMbbs">MBBS</label>
                                </td>
                                <td style={{ textAlign: "left" }}>
                                  <input type="checkbox" id="chkMdRadiology" name="specialization"
                                    value="MD-Radiology" onClick={event => this.addSpecialization(event, 'chkMdRadiology')} />
                                  <label for="chkMdRadiology">MD-Radiology</label>
                                </td>
                                <td style={{ textAlign: "left" }}>
                                  <input type="checkbox" id="chkMdAnaesthesia" name="specialization"
                                    value="MD-Anaesthesia" onClick={event => this.addSpecialization(event, 'chkMdAnaesthesia')} />
                                  <label for="chkMdAnaesthesia">MD-Anaesthesia</label>
                                </td>
                              </tr>
                              <tr>
                                <td style={{ textAlign: "left" }}>
                                  <input type="checkbox" id="chkMdPhysician" name="specialization"
                                    value="MD-Physician" onClick={event => this.addSpecialization(event, 'chkMdPhysician')} />
                                  <label for="chkMdPhysician">MD-Physician</label>
                                </td>
                                <td style={{ textAlign: "left" }}>
                                  <input type="checkbox" id="chkMdGynaecology" name="specialization"
                                    value="MD-Gynaecology" onClick={event => this.addSpecialization(event, 'chkMdGynaecology')} />
                                  <label for="chkMdGynaecology">MD-Gynaecology</label>
                                </td>
                                <td style={{ textAlign: "left" }}>
                                  <input type="checkbox" id="chkMdOrthopedics" name="specialization"
                                    value="MD-Orthopedics" onClick={event => this.addSpecialization(event, 'chkMdOrthopedics')} />
                                  <label for="chkMdOrthopedics">MD-Orthopedics</label>
                                </td>
                              </tr>
                              <tr>
                                <td style={{ textAlign: "left" }}>
                                  <input type="checkbox" id="chkMdEnt" name="specialization" 
                                  value="MD-ENT" onClick={event => this.addSpecialization(event, 'chkMdEnt')} />
                                  <label for="chkMdEnt">MD-ENT</label>
                                </td>
                                <td style={{ textAlign: "left" }}>
                                  <input type="checkbox" id="chkMdPathology" name="specialization"
                                    value="MD-Pathology" onClick={event => this.addSpecialization(event, 'chkMdPathology')} />
                                  <label for="chkMdPathology">MD-Pathology</label>
                                </td>
                                <td style={{ textAlign: "left" }}>
                                  <input type="checkbox" id="chkMsPlasticSurgery" name="specialization"
                                    value="MS-Plastic Surgery" onClick={event => this.addSpecialization(event, 'chkMsPlasticSurgery')} />
                                  <label for="chkMsPlasticSurgery">MS-Plastic Surgery</label>
                                </td>
                              </tr>
                              <tr>
                                <td style={{ textAlign: "left" }}>
                                  <input type="checkbox" id="chkMdCardiology" name="specialization"
                                    value="MD-Cardiology" onClick={event => this.addSpecialization(event, 'chkMdCardiology')} />
                                  <label for="chkMdCardiology">MD-Cardiology</label>
                                </td>
                                <td style={{ textAlign: "left" }}>
                                  <input type="checkbox" id="chkMdMicrobiology" name="specialization"
                                    value="MD-Microbiology" onClick={event => this.addSpecialization(event, 'chkMdMicrobiology')} />
                                  <label for="chkMdMicrobiology">MD-Microbiology</label>
                                </td>
                                <td style={{ textAlign: "left" }}>
                                  <input type="checkbox" id="chkMsUrology" name="specialization"
                                    value="MS-Urology" onClick={event => this.addSpecialization(event, 'chkMsUrology')} />
                                  <label for="chkMsUrology">MS-Urology</label>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td className="formFirstCol">
                          Total Experience :
                        </td>
                        <td style={{ textAlign: "left" }}>
                          <input type="text" className="textInput" id="totalExperience"
                            placeholder="Enter total experience in years"
                            onChange={event => this.inputChangeHandler(event, 'totalExperience')} />
                        </td>
                      </tr>
                      <tr>
                        <td className="formFirstCol">
                          Working Days :
                        </td>
                        <td style={{ textAlign: "left" }}>
                          <button type="button" id="btnMon" className="daysBox switchColor"
                            onClick={event => this.selectDay(event, 'btnMon')}><span className="daysBoxText">Mon</span></button>
                          <button type="button" id="btnTue" className="daysBox switchColor"
                            onClick={event => this.selectDay(event, 'btnTue')}><span className="daysBoxText">Tue</span></button>
                          <button type="button" id="btnWed" className="daysBox switchColor"
                            onClick={event => this.selectDay(event, 'btnWed')}><span className="daysBoxText">Wed</span></button>
                          <button type="button" id="btnThu" className="daysBox switchColor"
                            onClick={event => this.selectDay(event, 'btnThu')}><span className="daysBoxText">Thu</span></button>
                          <button type="button" id="btnFri" className="daysBox switchColor"
                            onClick={event => this.selectDay(event, 'btnFri')}><span className="daysBoxText">Fri</span></button>
                          <button type="button" id="btnSat" className="daysBox switchColor"
                            onClick={event => this.selectDay(event, 'btnSat')}><span className="daysBoxText">Sat</span></button>
                          <button type="button" id="btnSun" className="daysBox switchColor"
                            onClick={event => this.selectDay(event, 'btnSun')}><span className="daysBoxText">Sun</span></button>
                        </td>
                      </tr>
                      <tr>
                        <td className="formFirstCol">
                          Visiting Hours :
                        </td>
                        <td style={{ textAlign: "left" }}>
                          <label>From : </label>
                          <input type="text" className="textInputSmall" id="fromVisitingHour"
                            placeholder="Click to show timepicker" width="150px" height="30px"
                            onChange={event => this.inputChangeHandler(event, 'visitingHoursFrom')} />
                          <label style={{ paddingLeft: "40px" }}>To : </label>
                          <input type="text" className="textInputSmall" id="toVisitingHour"
                            placeholder="Click to show timepicker" width="150px" height="30px"
                            onChange={event => this.inputChangeHandler(event, 'visitingHoursTo')} />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
          <br />
          <table border="0" cellSpacing="0" cellPadding="0" width="100%">
            <colgroup>
              <col width="40%" />
              <col width="5%" />
              <col width="60%" />
            </colgroup>
            <tbody>
              <tr>
                <td style={{ textAlign: "right" }}>
                  <input type="submit" id="btnRegister" className="blueBtn" value="Register Me" onClick={this.addDoctorHandler} />
                </td>
                <td></td>
                <td style={{ textAlign: "left" }}>
                  <input type="reset" id="btnCancel" className="blueBtn" value="Cancel" onClick={this.resetValues} />
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

export default EditDoctorPage;