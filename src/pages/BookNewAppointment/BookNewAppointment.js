import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

import './BookNewAppointment.css';
import '../../../src/elements.css';
import '../../../src/util.js';
// import Input from '../../components/Input/Input';
// import Button from '../../components/Button/Button';
import $ from 'jquery';
// import Doctor from '../../components/Doctors/Doctor/Doctor';
// import Doctors from '../../components/Doctors/Doctors';
import DoctorCard from '../../components/DoctorCards/DoctorCard/DoctorCard';
import DoctorCards from '../../components/DoctorCards/DoctorCards';
// import { match } from 'assert';

var specializationArr = [];
var workingDaysArr = [];
var matchDuplicates = [];
let matchUnique = []; 
let uniqueObject = {};

class BookNewAppointmentPage extends Component {
  state = {
    isLoading: true,
    searchDoctors: [],
    noMatchWorkingDay: [],
    matchWorkingDay: [],
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

  selectDay = (event, btnId) => {
    var btnDay = document.getElementById(btnId);
    $(btnDay).toggleClass("daysBox daysBoxSelected");
    if (btnDay.className.includes('daysBoxSelected')) {
      this.addWorkingDays(event, btnId);
    }
    else {
      this.removeWorkingDays(event, btnId);
    }
  };

  addSpecialization = (event, specializationId) => {
    var specializationEl = document.getElementById(specializationId);
    if (specializationEl.checked === true) {
      specializationArr.push(specializationEl.value);
    }
    if (specializationEl.checked === false) {
      var unCheck = specializationArr.indexOf(specializationEl.value);
      if (unCheck > -1) {
        specializationArr.splice(unCheck, 1);
      }
    }
    this.setState({ specialization: specializationArr.join(", ") });
  };

  addWorkingDays = (event, workingDayId) => {
    var workingDayEl = document.getElementById(workingDayId);
    var workingDayId;
    workingDayId = workingDayEl.id;
    switch (workingDayId) {
      case 'btnMon':
        workingDaysArr.push('Monday');
        break;
      case 'btnTue':
        workingDaysArr.push('Tuesday');
        break;
      case 'btnWed':
        workingDaysArr.push('Wednesday');
        break;
      case 'btnThu':
        workingDaysArr.push('Thursday');
        break;
      case 'btnFri':
        workingDaysArr.push('Friday');
        break;
      case 'btnSat':
        workingDaysArr.push('Saturday');
        break;
      case 'btnSun':
        workingDaysArr.push('Sunday');
        break;
      default:
        break;
    }
    this.setState({ workingDays: workingDaysArr.join(", ") });
  };

  removeWorkingDays = (event, workingDayId) => {
    var workingDayEl = document.getElementById(workingDayId);
    var workingDayId = workingDayEl.id;
    var unSelect;
    switch (workingDayId) {
      case 'btnMon':
        unSelect = workingDaysArr.indexOf('Monday');
        break;
      case 'btnTue':
        unSelect = workingDaysArr.indexOf('Tuesday');
        break;
      case 'btnWed':
        unSelect = workingDaysArr.indexOf('Wednesday');
        break;
      case 'btnThu':
        unSelect = workingDaysArr.indexOf('Thursday');
        break;
      case 'btnFri':
        unSelect = workingDaysArr.indexOf('Friday');
        break;
      case 'btnSat':
        unSelect = workingDaysArr.indexOf('Saturday');
        break;
      case 'btnSun':
        unSelect = workingDaysArr.indexOf('Sunday');
        break;
      default:
        break;
    }
    if (unSelect > -1) {
      workingDaysArr.splice(unSelect, 1);
    }
    this.setState({ workingDays: workingDaysArr.join(", ") });
  };

  validateFormValues = () => {
    if (this.state.specialization.length === 0 || this.state.workingDays.length === 0) {
      throw "Please fill the above parameters to search for required doctors.";
    }
  }

  renderSearchedDoctors = () => {
    return this.state.searchDoctors.map((searchDoctor, index) => {
      const { _id, name, specialization, phoneNumber, totalExperience, workingDays, visitingHoursFrom, visitingHoursTo } = searchDoctor
      if (workingDays !== null || workingDays !== '') {
        var workingDaysSelected = this.state.workingDays.split(', ');
        var cnt = 0;
        for (var i = 0; i < workingDaysSelected.length; i++) {
          // if (this.state.matchWorkingDay.length > 1) {
          //   if (this.state.matchWorkingDay[this.state.matchWorkingDay.length - 1]._id === _id) {
          //     this.setState({ matchWorkingDay: this.state.matchWorkingDay.splice(this.state.matchWorkingDay.length - 1, 1) });
          //   }
          // }
          if (workingDays.includes(workingDaysSelected[i])) {
            cnt++;
            matchDuplicates.push(searchDoctor);
            //this.setState({ matchWorkingDay: this.state.matchWorkingDay.concat(searchDoctor) });
          }
        }
        for (let i in matchDuplicates) {
            var objId = matchDuplicates[i]['_id'];
            uniqueObject[objId] = matchDuplicates[i];
        }
        if (cnt === 0) {
          this.setState({ noMatchWorkingDay: this.state.noMatchWorkingDay.concat(searchDoctor) });
        }
      }
    });
  }

  searchDoctors = event => {
    event.preventDefault();
    try {
      this.validateFormValues();
    }
    catch (err) {
      this.setState({ isLoading: false });
      this.props.onError(err);
      return;
    }
    this.setState({ isLoading: true, matchWorkingDay: [], noMatchWorkingDay: [] });
    matchDuplicates = [];
    matchUnique = [];
    uniqueObject = [];
    const doctorSearchData = {
      specialization: this.state.specialization,
      workingDays: this.state.workingDays
    };
    // const queryParams = [];
    // for (let i in specializationArr)
    // {
    //   queryParams.push('specialization' + encodeURIComponent(i) + '=' + encodeURIComponent(specializationArr[i]));
    // }
    // for (let i in workingDaysArr)
    // {
    //   queryParams.push('workingDays' + encodeURIComponent(i) + '=' + encodeURIComponent(workingDaysArr[i]));
    // }
    // const queryString = queryParams.join('&');
    let request;
    request = axios.get('http://localhost:3100/searchdoctors/', { params: doctorSearchData });
    // request = axios.get('http://localhost:3100/searchdoctors'
    // + '/specialization/' + this.state.specialization.replace(", ", "&")
    // + '/workingDays/' + this.state.workingDays.replace(", ", "&"), doctorSearchData);
    request
      .then(result => {
        this.setState({ isLoading: false, searchDoctors: result.data });
        // this.props.history.push({
        //   pathname: '/searchdoctors',
        //   search: '?' + queryString
        // });
        //console.log(result);
        //this.props.history.replace('/searchdoctors');
        this.renderSearchedDoctors();
        for (let i in uniqueObject) {
          matchUnique.push(uniqueObject[i]);
        }
        this.setState({ matchWorkingDay: matchUnique });
        //console.log(matchUnique);
        //console.log(this.state.matchWorkingDay);
        //console.log(this.state.noMatchWorkingDay);
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
          'Searching doctors failed. Please try again later'
        );
      });
    specializationArr = [];
    workingDaysArr = [];
  };

  savePatientDetails = event => {
    event.preventDefault();
    if (
      this.state.patientName.trim() === '' ||
      this.state.patientPhone.trim() === '' ||
      this.state.patientAge.trim() === '' ||
      this.state.patientGender.trim() === '' ||
      this.state.patientProblem.trim() === '' ||
      this.state.appointmentDate.trim() === '' ||
      this.state.appointmentTime.trim() === ''
    ) {
      return;
    }
    this.setState({ isLoading: true });
    const patientData = {
      patientName: this.state.patientName,
      patientPhone: this.state.patientPhone,
      patientAge: this.state.patientAge,
      patientGender: this.state.patientGender,
      patientProblem: this.state.patientProblem,
      appointmentDate: this.state.appointmentDate,
      appointmentTime: this.state.appointmentTime
    };
    let request;
    request = axios.post('http://localhost:3100/patients', patientData);
    request
      .then(result => {
        this.setState({ isLoading: false });
        //this.props.history.replace('/patients');
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
          'Saving patient details failed. Please try again later'
        );
      });
  };

  bookAppointmentPatient = event => {
    event.preventDefault();
    if (
      this.state.name.trim() === '' ||
      this.state.phoneNumber.trim() === '' ||
      this.state.specialization.trim() === '' ||
      this.state.totalExperience.trim() === '' ||
      this.state.workingDays.trim() === '' ||
      this.state.patientName.trim() === '' ||
      this.state.patientPhone.trim() === '' ||
      this.state.patientAge.trim() === '' ||
      this.state.patientGender.trim() === '' ||
      this.state.patientProblem.trim() === '' ||
      this.state.appointmentDate.trim() === '' ||
      this.state.appointmentTime.trim() === ''
    ) {
      return;
    }
    this.setState({ isLoading: true });
    const appointmentData = {
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
    request = axios.post('http://localhost:3100/appointment', appointmentData);
    request
      .then(result => {
        this.setState({ isLoading: false });
        this.props.history.replace('/appointment');
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
  };

  render() {
    let content = (
      <div>
        <form className="book-appointment__form" onSubmit={this.searchDoctors}>
          <h2>Book New Appointment</h2>
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
                          Available Days :
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
                        <td colSpan="2" style={{ textAlign: "center" }}>
                          <input type="submit" id="btnSearchDr" className="blueBtn" value="Search Doctors"
                            onClick={this.searchDoctors} />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </form>
        <br />
        <br />
        {this.state.matchWorkingDay.length !== 0 ? <DoctorCards doctors={this.state.matchWorkingDay} /> : null}
        <br />
        <br />
      </div>
    );
    if (this.state.isLoading) {
      content = <p>Is loading...</p>;
    }
    return <main>{content}</main>;
  }
}

// function DoctorCard(props) {
//   return (
//     <div className="doctor-card">
//       <div className="doctor-card-name">
//         <h5>Dr. {props.name}</h5>
//       </div>
//       Specialization : {props.specialization}
//       <br />
//       Total Experience : {props.totalExperience} years
//       <br />
//       Address : {props.address}
//       <br />
//       <input type="submit" id="btnBookAppointment" className="blueBtn buttonRight" value="Book Appointment" />
//     </div>
//   );
// }

// var doctorApptCard = (
//   <div>
//     <DoctorCard name="Satish Kashyap" specialization="MBBS" totalExperience="10" address="Apollo, Jubilee Hills" />
//     <DoctorCard name="Dexter Jones" specialization="MD-ENT" totalExperience="9" address="Apollo, Kukatpally" />
//   </div>
// );

// ReactDOM.render(doctorApptCard, document.getElementById('doctorApptCard'));

export default BookNewAppointmentPage;