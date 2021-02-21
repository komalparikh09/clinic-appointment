import React, { Component } from 'react';
import axios from 'axios';

import './EditDoctor.css';
import '../../../src/elements.css';
import '../../../src/util.js';
// import Input from '../../components/Input/Input';
// import Button from '../../components/Button/Button';
import $ from 'jquery';

//const $ = window.$;
var specializationArr = [];
var workingDaysArr = [];

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
          document.getElementById('doctorName').value = this.state.name;
          document.getElementById('doctorPhone').value = this.state.phoneNumber;
          this.editLoadSpecialization(this.state.specialization);
          document.getElementById('totalExperience').value = this.state.totalExperience;
          this.editLoadWorkingDays(this.state.workingDays);
          document.getElementById('fromVisitingHour').value = this.state.visitingHoursFrom;
          document.getElementById('toVisitingHour').value = this.state.visitingHoursTo;
        })
        .catch(err => {
          this.setState({ isLoading: false });
          console.log(err);
        });
    } else {
      this.setState({ isLoading: false });
    }
  }

  editDoctorHandler = event => {
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
      specialization: this.state.specialization,
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
          'Editing the doctor account details failed. Please try again later'
        );
      });
    specializationArr = [];
    workingDaysArr = [];
  };

  inputChangeHandler = (event, input) => {
    this.setState({ [input]: event.target.value });
  };

  resetValues = event => {
    this.setState({ name: '' });
    this.setState({ phoneNumber: '' });
    this.setState({ specialization: '' });
    this.setState({ totalExperience: '' });
    this.setState({ workingDays: '' });
    this.setState({ visitingHoursFrom: '' });
    this.setState({ visitingHoursTo: '' });
    specializationArr = [];
    workingDaysArr = [];
    var x = document.getElementsByClassName('daysBoxSelected')
    while (x.length > 0) {
      x[0].className = 'daysBox';
    }
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
          'Resetting the doctor details failed. Please try again later'
        );
      });
  };

  editLoadSpecialization = (specialization) => {
    var specializationArrEdit = specialization.split(',');
    var i = 0;
    while (i < specializationArrEdit.length) {
      //var specializationChkBoxes = document.getElementsByName('specialization');
      $('input:checkbox:not(:checked)').each(function () {
        if (this.value === specializationArrEdit[i].trim()) {
          this.checked = true;
        }
        //alert("Id: " + $(this).attr("id") + " Value: " + $(this).val());
      });
      i++;
    }
  };

  editLoadWorkingDays = (workingDays) => {
    var workingDaysArrEdit = workingDays.split(',');
    var i = 0;
    while (i < workingDaysArrEdit.length) {
      switch (workingDaysArrEdit[i].trim()) {
        case 'Monday':
          this.selectDay(this, 'btnMon');
          break;
        case 'Tuesday':
          this.selectDay(this, 'btnTue');
          break;
        case 'Wednesday':
          this.selectDay(this, 'btnWed');
          break;
        case 'Thursday':
          this.selectDay(this, 'btnThu');
          break;
        case 'Friday':
          this.selectDay(this, 'btnFri');
          break;
        case 'Saturday':
          this.selectDay(this, 'btnSat');
          break;
        case 'Sunday':
          this.selectDay(this, 'btnSun');
          break;
        default:
          break;
      }
      i++;
    }
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

  // selectTime = (event, optionlist, txtId) => {
  //   var example = optionlist.selectedIndex;
  //   var demo = txtId.options[example].innerHTML;
  //   var demo = txtId.options[example].value;
  // };

  render() {
    let content = (
      <div>
        <form className="add-doctor__form" onSubmit={this.editDoctorHandler}>
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
                          <select id="fromVisitingHour" name="" className="textInputSmall" width="150px" height="30px"
                            onChange={event => this.inputChangeHandler(event, 'visitingHoursFrom')}>
                            <option value="" disabled selected hidden style={{ paddingLeft: "10px", color: "#D3D3D3" }}>Click to show timepicker</option>
                            <option>12:00 A.M.</option>
                            <option>01:00 A.M.</option>
                            <option>02:00 A.M.</option>
                            <option>03:00 A.M.</option>
                            <option>04:00 A.M.</option>
                            <option>05:00 A.M.</option>
                            <option>06:00 A.M.</option>
                            <option>07:00 A.M.</option>
                            <option>08:00 A.M.</option>
                            <option>09:00 A.M.</option>
                            <option>10:00 A.M.</option>
                            <option>11:00 A.M.</option>
                            <option>12:00 P.M.</option>
                            <option>01:00 P.M.</option>
                            <option>02:00 P.M.</option>
                            <option>03:00 P.M.</option>
                            <option>04:00 P.M.</option>
                            <option>05:00 P.M.</option>
                            <option>06:00 P.M.</option>
                            <option>07:00 P.M.</option>
                            <option>08:00 P.M.</option>
                            <option>09:00 P.M.</option>
                            <option>10:00 P.M.</option>
                            <option>11:00 P.M.</option>
                          </select>
                          {/* <input type="text" className="textInputSmall" id="fromVisitingHour" class="timepicker"
                            placeholder="Click to show timepicker" width="150px" height="30px"
                            onChange={event => this.inputChangeHandler(event, 'visitingHoursFrom')} /> */}
                          <label style={{ paddingLeft: "40px" }}>To : </label>
                          <select id="toVisitingHour" name="" className="textInputSmall" width="150px" height="30px"
                            onChange={event => this.inputChangeHandler(event, 'visitingHoursTo')}>
                            <option value="" disabled selected hidden style={{ paddingLeft: "10px", color: "#D3D3D3" }}>Click to show timepicker</option>
                            <option>12:00 A.M.</option>
                            <option>01:00 A.M.</option>
                            <option>02:00 A.M.</option>
                            <option>03:00 A.M.</option>
                            <option>04:00 A.M.</option>
                            <option>05:00 A.M.</option>
                            <option>06:00 A.M.</option>
                            <option>07:00 A.M.</option>
                            <option>08:00 A.M.</option>
                            <option>09:00 A.M.</option>
                            <option>10:00 A.M.</option>
                            <option>11:00 A.M.</option>
                            <option>12:00 P.M.</option>
                            <option>01:00 P.M.</option>
                            <option>02:00 P.M.</option>
                            <option>03:00 P.M.</option>
                            <option>04:00 P.M.</option>
                            <option>05:00 P.M.</option>
                            <option>06:00 P.M.</option>
                            <option>07:00 P.M.</option>
                            <option>08:00 P.M.</option>
                            <option>09:00 P.M.</option>
                            <option>10:00 P.M.</option>
                            <option>11:00 P.M.</option>
                          </select>
                          {/* <input type="text" className="textInputSmall" id="toVisitingHour" class="timepicker"
                            placeholder="Click to show timepicker" width="150px" height="30px"
                            onChange={event => this.inputChangeHandler(event, 'visitingHoursTo')} /> */}
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
                  <input type="submit" id="btnRegister" className="blueBtn" value="Update Details" onClick={this.editDoctorHandler} />
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