import React, { Component } from 'react';
import axios from 'axios';

import './DoctorDashboard.css';
import '../../../src/elements.css';
import '../../../src/util.js';
// import Input from '../../components/Input/Input';
// import Button from '../../components/Button/Button';
// import $ from 'jquery';

const $ = window.$;

class DoctorDashboardPage extends Component {
  state = {
    isLoading: true,
    appointments: [],
    pastApptExists: false,
    futureApptExists: false,
    tblRendersPastAppt: false,
    tblRendersFutureAppt: false,
    noAppointments: false,
    tblRenders: false,
    doctorLogin: false,
    noAppointments: false,
    _id: '',
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
    this.setState({ isLoading: false });
    //document.getElementById('doctorId').value = this.state.doctorId;
    //document.getElementById('phoneNumber').value = this.state.phoneNumber;
    //document.getElementById('patientPhone').value = this.state.patientPhone;
    //document.getElementById('appointmentDate').value = this.state.appointmentDate;
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    return this.state;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (snapshot.futureApptExists) {
      if (this.state.tblRenders && !this.state.tblRendersFutureAppt) {
        $('#tblFutureAppt').DataTable({
          responsive: {
            details: {
              type: 'column'
            }
          },
          columnDefs: [{
            className: 'control',
            orderable: false,
            targets: 0
          }],
          columns: [
            { "type": "string", "orderable": false },
            { "type": "number", "orderable": true },
            { "type": "string", "orderable": true },
            { "type": "date", "orderable": true },
            { "type": "number", "orderable": true },
            { "type": "number", "orderable": true },
            { "type": "string", "orderable": true },
            { "type": "string", "orderable": true }
          ],
          paging: false,
          "order": [[1, 'asc']],
          "bInfo": false,
          searchable: false,
          fixedColumns: true
        });
        this.setState({ tblRendersFutureAppt: true });
      }
    }
    if (snapshot.pastApptExists) {
      if (this.state.tblRenders && !this.state.tblRendersPastAppt) {
        $('#tblPastAppt').DataTable({
          responsive: {
            details: {
              type: 'column'
            }
          },
          columnDefs: [
            { className: 'control', orderable: false, targets: 0 },
          ],
          columns: [
            { "type": "string", "orderable": false },
            { "type": "number", "orderable": true },
            { "type": "string", "orderable": true },
            { "type": "date", "orderable": true },
            { "type": "number", "orderable": true },
            { "type": "number", "orderable": true },
            { "type": "string", "orderable": true },
            { "type": "string", "orderable": true }
          ],
          paging: false,
          "order": [[1, 'asc']],
          "bInfo": false,
          searchable: false,
          fixedColumns: true
        });
        this.setState({ tblRendersPastAppt: true });
      }
    }
  }

  inputChangeHandler = (event, input) => {
    this.setState({ [input]: event.target.value });
  };

  validateFormValuesDoctorDetails = () => {
    if (this.state.doctorId.length === 0 && this.state.phoneNumber.length === 0) {
      throw "Please fill either the doctor ID or the doctor phone number before submitting the request.";
    }
    else {
      if (this.state.phoneNumber.length !== 0) {
        if (this.state.phoneNumber.length !== 10) {
          throw "Please enter a valid phone number for the doctor.";
        }
      }
    }
  }

  validateFormValuesPatientDetails = () => {
    if (this.state.patientPhone.length === 0 && this.state.appointmentDate.length === 0) {
      throw "Please fill either the patient phone number or the appointment date before submitting the request.";
    }
    else {
      if (this.state.patientPhone.length !== 0) {
        if (this.state.patientPhone.length !== 10) {
          throw "Please enter a valid phone number for the patient.";
        }
      }
      if (this.state.appointmentDate.length !== 0) {
        if (this.state.appointmentDate.length !== 10) {
          throw "Please enter a valid appointment date in mm/dd/yyyy format."
        }
      }
    }
  }

  getDetailsHandler = event => {
    event.preventDefault();
    try {
      this.validateFormValuesDoctorDetails();
    }
    catch (err) {
      this.setState({ isLoading: false, tblRenders: false, tblRendersPastAppt: false, tblRendersFutureAppt: false });
      this.props.onError(err);
      return;
    }
    this.setState({ isLoading: true, tblRenders: false, tblRendersPastAppt: false, tblRendersFutureAppt: false });
    const appointmentData = {
      doctorId: this.state.doctorId,
      phoneNumber: this.state.phoneNumber
    };
    let request;
    request = axios.get('http://localhost:3100/appointment/doctordetails/', { params: appointmentData });
    request
      .then(result => {
        this.setState({ isLoading: false, appointments: result.data, pastApptExists: false, futureApptExists: false, tblRenders: true });
        //this.props.history.replace('/appointment/doctordetails');
        if (result.data.length !== 0) {
          this.setState({ doctorLogin: true, noAppointments: false, name: result.data[0].name, specialization: result.data[0].specialization });
          document.getElementById("doctorName").innerHTML = this.state.name;
          document.getElementById("specialization").innerHTML = this.state.specialization;
        }
        if (result.data.length === 0) {
          this.setState({ noAppointments: true });
        }
        this.checkApptDates();
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
          'Fetching the appointment details failed. Please try again later'
        );
      });
  };

  getAppointmentsHandler = event => {
    event.preventDefault();
    try {
      this.validateFormValuesPatientDetails();
    }
    catch (err) {
      this.setState({ isLoading: false, tblRenders: false, tblRendersPastAppt: false, tblRendersFutureAppt: false });
      this.props.onError(err);
      return;
    }
    this.setState({ isLoading: true, tblRenders: false, tblRendersPastAppt: false, tblRendersFutureAppt: false });
    const appointmentData = {
      patientPhone: this.state.patientPhone,
      appointmentDate: this.state.appointmentDate
    };
    let request;
    request = axios.get('http://localhost:3100/appointment/patientdetails/', { params: appointmentData });
    request
      .then(result => {
        this.setState({ isLoading: false, appointments: result.data, pastApptExists: false, futureApptExists: false, noAppointments: false, tblRenders: true });
        //this.props.history.replace('/appointment/patientdetails');
        document.getElementById("doctorName").innerHTML = this.state.name;
        document.getElementById("specialization").innerHTML = this.state.specialization;
        if (result.data.length === 0) {
          this.setState({ noAppointments: true });
        }
        this.checkApptDates();
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
          'Fetching the scheduled appointments failed. Please try again later'
        );
      });
  };

  checkApptDates() {
    const now = new Date();
    if (this.state.appointments.length > 0) {
      this.state.appointments.map((appointment, index) => {
        if (appointment.appointmentDate !== null || appointment.appointmentDate !== '') {
          const appointmentDateM = new Date(appointment.appointmentDate);
          if (appointment.doctorId === this.state.doctorId || appointment.phoneNumber === this.state.phoneNumber) {
            if (now > appointmentDateM) {
              this.setState({ pastApptExists: true });
            }
            if (now < appointmentDateM) {
              this.setState({ futureApptExists: true })
            }
          }
        }
      });
    }
  }

  renderPastTableData() {
    const now = new Date();
    return this.state.appointments.map((appointment, index) => {
      const { _id, patientPhone, patientName, appointmentDate, appointmentTime, patientAge, patientGender, patientProblem } = appointment
      if (appointmentDate !== null || appointmentDate !== '') {
        const appointmentDateM = new Date(appointmentDate);
        const dateTimeFormat = new Intl.DateTimeFormat('en', { year: 'numeric', month: 'short', day: 'numeric' });
        const [{ value: month }, , { value: day }, , { value: year }] = dateTimeFormat.formatToParts(appointmentDateM);
        if (appointment.doctorId === this.state.doctorId || appointment.phoneNumber === this.state.phoneNumber) {
          if (now > appointmentDateM) {
            return (
              <tr key={_id}>
                <td className="details-control parent"></td>
                <td className="parent">{patientPhone}</td>
                <td className="parent">{patientName}</td>
                <td className="parent">{`${day} ${month} ${year}`}</td>
                <td className="parent">{appointmentTime}</td>
                <td className="cchild">{patientAge} years</td>
                <td className="cchild">{patientGender}</td>
                <td className="cchild">{patientProblem}</td>
              </tr>
            )
          }
          else {
            return null;
          }
        }
        else {
          return null;
        }
      }
    });
  }

  renderFutureTableData() {
    const now = new Date();
    return this.state.appointments.map((appointment, index) => {
      const { _id, patientPhone, patientName, appointmentDate, appointmentTime, patientAge, patientGender, patientProblem } = appointment
      if (appointmentDate !== null || appointmentDate !== '') {
        const appointmentDateM = new Date(appointmentDate);
        const dateTimeFormat = new Intl.DateTimeFormat('en', { year: 'numeric', month: 'short', day: 'numeric' });
        const [{ value: month }, , { value: day }, , { value: year }] = dateTimeFormat.formatToParts(appointmentDateM);
        if (appointment.doctorId === this.state.doctorId || appointment.phoneNumber === this.state.phoneNumber) {
          if (now < appointmentDateM) {
            return (
              <tr key={_id}>
                <td className="details-control parent"></td>
                <td className="parent">{patientPhone}</td>
                <td className="parent">{patientName}</td>
                <td className="parent">{`${day} ${month} ${year}`}</td>
                <td className="parent">{appointmentTime}</td>
                <td className="cchild">{patientAge} years</td>
                <td className="cchild">{patientGender}</td>
                <td className="cchild">{patientProblem}</td>
              </tr>
            )
          }
          else {
            return null;
          }
        }
        else {
          return null;
        }
      }
    });
  }

  renderTableHeader() {
    let headerElement = ['', 'Patient Phone Number', 'Patient Name', 'Appointment Date', 'Appointment Time', 'Patient Age', 'Patient Gender', 'Patient Problem']
    return headerElement.map((key, index) => {
      return <th key={index}>{key}</th>
    })
  }

  render() {
    let futureApptTable = (
      <div>
        <h4>Future Appointments</h4>
        <table border="0" width="90%" cellSpacing="0" cellPadding="0" id="tblFutureAppt" className="display responsive nowrap">
          <thead>
            <tr>
              {this.renderTableHeader()}
            </tr>
          </thead>
          <tbody>
            {this.renderFutureTableData()}
          </tbody>
        </table>
      </div>
    );
    let pastApptTable = (
      <div>
        <h4>Past Appointments</h4>
        <table border="0" width="90%" cellSpacing="0" cellPadding="0" id="tblPastAppt" className="display responsive nowrap">
          <thead>
            <tr>
              {this.renderTableHeader()}
            </tr>
          </thead>
          <tbody>
            {this.renderPastTableData()}
          </tbody>
        </table>
      </div>
    );
    let content = (
      <div>
        <div style={{ float: "left" }}>
          <h2>Doctor Dashboard</h2>
        </div>
        {this.state.doctorLogin === true ?
          <div style={{ float: "right", display: "inline" }}>
            <br />
            <div>Name: <span id="doctorName"></span></div>
            <div> Specialization: <span id="specialization"></span></div>
            <br />
          </div> : null}
        <br />
        <table border="1" width="90%" style={{ borderCollapse: "collapse" }} cellSpacing="5" cellPadding="5">
          <colgroup>
            <col width="100%" />
          </colgroup>
          <tbody>
            <tr>
              <td>
                <table border="0" cellSpacing="10" cellPadding="10" width="100%">
                  <colgroup>
                    <col width="20%" />
                    <col width="30%" />
                    <col width="10%" />
                    <col width="20%" />
                    <col width="30%" />
                  </colgroup>
                  <tbody>
                    <tr>
                      <td className="formFirstCol" style={{ verticalAlign: "middle" }}>
                        Doctor ID
                        </td>
                      <td style={{ textAlign: "center" }}>
                        <input type="text" className="textInput" id="doctorId" value={this.state.doctorId}
                          placeholder="Enter valid doctor ID" onChange={event => this.inputChangeHandler(event, 'doctorId')} />
                      </td>
                      <td className="formFirstCol" style={{ verticalAlign: "middle" }}>
                        Or
                        </td>
                      <td className="formFirstCol" style={{ verticalAlign: "middle" }}>
                        Phone Number
                        </td>
                      <td style={{ textAlign: "center" }}>
                        <input type="text" className="textInput" id="phoneNumber" value={this.state.phoneNumber}
                          placeholder="Enter valid Phone Number" onChange={event => this.inputChangeHandler(event, 'phoneNumber')} />
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="5" style={{ textAlign: "center" }}>
                        <input type="button" id="btnGetDetails" className="GetDetailsBtn" value="Get Details"
                          onClick={this.getDetailsHandler} />
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
        <table border="1" width="90%" style={{ borderCollapse: "collapse" }} cellSpacing="5" cellPadding="5">
          <colgroup>
            <col width="100%" />
          </colgroup>
          <tbody>
            <tr>
              <td>
                <table border="0" cellSpacing="10" cellPadding="10" width="100%">
                  <colgroup>
                    <col width="40%" />
                    <col width="30%" />
                    <col width="30%" />
                    <col width="30%" />
                  </colgroup>
                  <tbody>
                    <tr>
                      <td className="formFirstCol" style={{ verticalAlign: "middle" }}>
                        Patient Phone Number
                        </td>
                      <td style={{ textAlign: "center" }}>
                        <input type="text" className="textInput" id="patientPhone" value={this.state.patientPhone}
                          placeholder="Enter valid Phone Number" onChange={event => this.inputChangeHandler(event, 'patientPhone')} />
                      </td>
                      <td className="formFirstCol" style={{ verticalAlign: "middle" }}>
                        Appointment Date
                        </td>
                      <td style={{ textAlign: "center" }}>
                        <input type="text" className="textInput" id="appointmentDate" value={this.state.appointmentDate}
                          placeholder="mm/dd/yyyy" onChange={event => this.inputChangeHandler(event, 'appointmentDate')} />
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="5" style={{ textAlign: "center" }}>
                        <input type="button" id="btnGetAppointments" className="GetDetailsBtn" value="Get Appointments"
                          onClick={this.getAppointmentsHandler} />
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
        {this.state.noAppointments === true ? <span>You have no scheduled appointments.</span> : null}
        <br />
        <br />
        <div style={{ width: "80%", alignSelf: "center" }}>
          {this.state.futureApptExists === true ? futureApptTable : null}
        </div>
        <br />
        <br />
        <div style={{ width: "80%", alignSelf: "center" }}>
          {this.state.pastApptExists === true ? pastApptTable : null}
        </div>
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

export default DoctorDashboardPage;