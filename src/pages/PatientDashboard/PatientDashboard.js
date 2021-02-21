import React, { Component } from 'react';
import axios from 'axios';
//import DataTable from 'react-data-table-component';
import { IconContext } from 'react-icons/';
import { FaEdit, FaWindowClose, FaCircleNotch, FaRegEdit } from 'react-icons/fa';

import './PatientDashboard.css';
import '../../../src/elements.css';
import '../../../src/util.js';
// import Input from '../../components/Input/Input';
// import Button from '../../components/Button/Button';
// import $, { now } from 'jquery';
// import appointments from '../../components/PatientAppointments/PatientAppointments';

const $ = window.$;

// let data = [];
// const columns = [
//   {
//     name: 'Doctor ID',
//     selector: 'id',
//     sortable: true,
//   },
//   {
//     name: 'Doctor Name',
//     selector: 'name',
//     sortable: true,
//     right: true,
//   },
//   {
//     name: 'Specialization',
//     selector: 'specialization',
//     sortable: true,
//     right: true,
//   },
//   {
//     name: 'Appointment Date',
//     selector: 'appointmentDate',
//     sortable: true,
//     right: true,
//   },
//   {
//     name: 'Action',
//     selector: 'id',
//     sortable: true,
//     right: true,
//   },
//   {
//     name: 'Doctor Phone Number',
//     selector: 'phoneNumber',
//     sortable: true,
//     right: true,
//   },
//   {
//     name: 'Doctor Total Experience',
//     selector: 'totalExperience',
//     sortable: true,
//     right: true,
//   },
//   {
//     name: 'Doctor Working Days',
//     selector: 'workingDays',
//     sortable: true,
//     right: true,
//   },
// ];
// const ExpanableComponent = ({ data }) => {
//   return (
//     <div>
//       <p>{data.phoneNumber}</p>
//       <p>{data.totalExperience}</p>
//       <p>{data.workingDays}</p>
//     </div>
// )};

class PatientDashboardPage extends Component {
  state = {
    isLoading: true,
    appointments: [],
    pastApptExists: false,
    futureApptExists: false,
    tblRendersPastAppt: false,
    tblRendersFutureAppt: false,
    noAppointments: false,
    tblRenders: false,
    _id: '',
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

  //const [appointments, setAppointments] = useState([]);

  componentDidMount() {
    this.setState({ isLoading: false });
    // if (this.props.match.params.patientPhone !== '' || this.props.match.params.patientPhone !== undefined) {
    //   axios
    //     .get('http://localhost:3100/appointment/')// + this.props.match.params.patientPhone)
    //     .then(appointmentResponse => {
    //       this.setState({ isLoading: false, appointment: appointmentResponse.data });
    //     })
    //     .catch(err => {
    //       this.setState({ isLoading: false });
    //       console.log(err);
    //       this.props.onError('Loading the appointments failed. Please try again later');
    //     });
    // }
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
            { "type": "string", "orderable": true },
            { "type": "string", "orderable": true },
            { "type": "string", "orderable": true },
            { "type": "date", "orderable": true },
            { "type": "string", "orderable": false },
            { "type": "number", "orderable": true },
            { "type": "number", "orderable": true },
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
            { "type": "string", "orderable": true },
            { "type": "string", "orderable": true },
            { "type": "string", "orderable": true },
            { "type": "date", "orderable": true },
            { "type": "number", "orderable": true },
            { "type": "number", "orderable": true },
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

  bookNewAppointment = (event) => {
    let request;
    request = axios.get('http://localhost:3100/appointment');
    request
      .then(result => {
        this.setState({ isLoading: false });
        //this.props.history.replace('/appointment');
        const err = {
          message: 'throwing sample error'
        }
        throw err;
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
            this.props.onError(
              'Booking a new appointment failed. Please try again later'
            );
            return;
          });
      });
  };

  getPatientDetails = (event, patientPhone) => {
    event.preventDefault();
    try {
      if (this.state.patientPhone.trim() === '') {
        throw "Please enter a phone number.";
      }
      if (this.state.patientPhone.length !== 10) {
        throw "Please enter a valid phone number.";
      }
    }
    catch (err) {
      this.setState({ isLoading: false, tblRenders: false, tblRendersPastAppt: false, tblRendersFutureAppt: false });
      this.props.onError(err);
      return;
    }
    this.setState({ isLoading: true, tblRenders: false, tblRendersPastAppt: false, tblRendersFutureAppt: false });
    const patientData = {
      patientPhone: this.state.patientPhone,
    };
    let request;
    request = axios.get('http://localhost:3100/appointment/' + 'patient/' + patientData.patientPhone);
    request
      .then(result => {
        this.setState({ isLoading: false, appointments: result.data, pastApptExists: false, futureApptExists: false, noAppointments: false, tblRenders: true });
        //data = [{ id: result.data._id, name: result.data.name, specialization: result.data.specialization,  appointmentDate: result.data.appointmentDate, phoneNumber: result.data.phoneNumber, totalExperience: result.data.totalExperience, workingDays: result.data.workingDays }];
        //this.props.history.replace('/appointment/patient/' + patientData.patientPhone);
        document.getElementById('patientPhone').value = this.state.patientPhone;
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
          'Fetching patient appointment details failed. Please try again later'
        );
      });
  };

  cancelAppointmentHandler = (id) => {
    let request;
    request = axios.delete('http://localhost:3100/appointment/' + id);
    request
      .then(result => {
        this.setState({ isLoading: false });
        document.getElementById('patientPhone').value = this.state.patientPhone;
        const postDel = this.state.appointments.filter(appointment => appointment._id !== id);
        this.setState({ appointments: postDel });
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
          'Deleting patient appointment failed. Please try again later'
        );
      });
  }

  editAppointmentHandler = (id) => {
    let request;
    request = axios.get('http://localhost:3100/appointment/' + id);
    request
      .then(result => {
        this.setState({ isLoading: false });
        document.getElementById('patientPhone').value = this.state.patientPhone;
        //console.log(result);
        this.props.history.replace('/appointments/' + id + '/edit');
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
          'Editing patient appointment failed. Please try again later'
        );
      });
  }

  checkApptDates() {
    const now = new Date();
    if (this.state.appointments.length > 0) {
      this.state.appointments.map((appointment, index) => {
        if (appointment.appointmentDate !== null || appointment.appointmentDate !== '') {
          const appointmentDateM = new Date(appointment.appointmentDate);
          if (now > appointmentDateM) {
            this.setState({ pastApptExists: true });
          }
          if (now < appointmentDateM) {
            this.setState({ futureApptExists: true });
          }
        }
      });
    }
  }

  renderPastTableData() {
    const now = new Date();
    return this.state.appointments.map((appointment, index) => {
      const { _id, name, specialization, appointmentDate, phoneNumber, totalExperience, workingDays } = appointment
      if (appointmentDate !== null || appointmentDate !== '') {
        const appointmentDateM = new Date(appointmentDate);
        const dateTimeFormat = new Intl.DateTimeFormat('en', { year: 'numeric', month: 'short', day: 'numeric' });
        const [{ value: month }, , { value: day }, , { value: year }] = dateTimeFormat.formatToParts(appointmentDateM);
        if (now > appointmentDateM) {
          return (
            <tr key={_id}>
              <td className="details-control parent"></td>
              <td className="parent">{_id}</td>
              <td className="parent">{name}</td>
              <td className="parent">{specialization.replaceAll('MD-', '').replaceAll('MS-', '').replaceAll('MD', '')}</td>
              <td className="parent">{`${day} ${month} ${year}`}</td>
              <td className="cchild">{phoneNumber}</td>
              <td className="cchild">{totalExperience} years</td>
              <td className="cchild">{workingDays}</td>
            </tr>
          )
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
      const { _id, name, specialization, appointmentDate, phoneNumber, totalExperience, workingDays } = appointment
      if (appointmentDate !== null || appointmentDate !== '') {
        const appointmentDateM = new Date(appointmentDate);
        const dateTimeFormat = new Intl.DateTimeFormat('en', { year: 'numeric', month: 'short', day: 'numeric' });
        const [{ value: month }, , { value: day }, , { value: year }] = dateTimeFormat.formatToParts(appointmentDateM);
        if (now < appointmentDateM) {
          return (
            <tr key={_id}>
              <td className="details-control parent"></td>
              <td className="parent">{_id}</td>
              <td className="parent">{name}</td>
              <td className="parent">{specialization.replaceAll('MD-', '').replaceAll('MS-', '').replaceAll('MD', '')}</td>
              <td className="parent">{`${day} ${month} ${year}`}</td>
              <td className="parent">
                <IconContext.Provider value={{ color: "#5FBD05", className: "global-class-name", size: "1.5em" }}>
                  <div>
                    <FaEdit onClick={() => this.editAppointmentHandler(_id)} />
                  </div>
                </IconContext.Provider>
                <IconContext.Provider value={{ color: "#2A9108", className: "global-class-name", size: "1.5em" }}>
                  <div>
                    <FaWindowClose onClick={() => this.cancelAppointmentHandler(_id)} />
                  </div>
                </IconContext.Provider>
              </td>
              <td className="cchild">{phoneNumber}</td>
              <td className="cchild">{totalExperience} years</td>
              <td className="cchild">{workingDays}</td>
            </tr>
          )
        }
        else {
          return null;
        }
      }
    });
  }

  renderTableHeaderForPast() {
    let headerElement = ['', 'Doctor ID', 'Doctor Name', 'Specialization', 'Appointment Date', 'Doctor Phone Number', 'Doctor Total Experience', 'Doctor Working Days']
    return headerElement.map((key, index) => {
      return <th key={index}>{key}</th>
    })
  }

  renderTableHeaderForFuture() {
    let headerElement = ['', 'Doctor ID', 'Doctor Name', 'Specialization', 'Appointment Date', 'Action', 'Doctor Phone Number', 'Doctor Total Experience', 'Doctor Working Days']
    return headerElement.map((key, index) => {
      return <th key={index}>{key}</th>
    })
  }

  render() {
    let futureApptTable = (
      <div>
        <h4>Future Appointments</h4>
        <table border="0" width="90%" cellSpacing="0" cellPadding="0" id="tblFutureAppt" className="display responsive nowrap">
          {/* <colgroup>
            <col width="10%" />
            <col width="30%" />
            <col width="20%" />
            <col width="30%" />
            <col width="20%" />
            <col width="10%" />
          </colgroup> */}
          <thead>
            <tr>
              {this.renderTableHeaderForFuture()}
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
          {/* <colgroup>
            <col width="10%" />
            <col width="30%" />
            <col width="20%" />
            <col width="30%" />
            <col width="20%" />
        </colgroup> */}
          <thead>
            <tr>
              {this.renderTableHeaderForPast()}
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
        <h2>Patient Dashboard</h2>
        <br />
        <table border="0" width="90%" cellSpacing="0" cellPadding="0">
          <colgroup>
            <col width="100%" />
          </colgroup>
          <tbody>
            <tr>
              <td className="formFirstCol">
                <input type="button" id="btnBookAppt" className="greenBtn" value="Book New Appointment"
                  onClick={event => this.bookNewAppointment(event)} />
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
                    <col width="30%" />
                    <col width="40%" />
                    <col width="30%" />
                  </colgroup>
                  <tbody>
                    <tr>
                      <td className="formFirstCol" style={{ verticalAlign: "middle" }}>
                        Patient Phone Number
                        </td>
                      <td style={{ textAlign: "center" }}>
                        <input type="text" className="textInput" id="patientPhone"
                          placeholder="Enter 10 digit mobile number" onChange={event => this.inputChangeHandler(event, 'patientPhone')} />
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <input type="button" id="btnGetDetails" className="GetDetailsBtn" value="Get Details"
                          onClick={event => this.getPatientDetails(event, 'patientPhone')} />
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
        {/* <DataTable
          title="Future Appointments"
          columns={columns}
          data={data}
          expandableRows
          expandableRowsComponent={<ExpanableComponent />}
        /> */}
        {/* <colgroup>
            <col width="20%" />
            <col width="10%" />
            <col width="10%" />
            <col width="10%" />
            <col width="20%" />
            <col width="10%" />
            <col width="10%" />
            <col width="10%" />
          </colgroup> */}
        <div style={{ width: "90%", alignSelf: "center" }}>
          {this.state.futureApptExists === true ? futureApptTable : null}
        </div>
        <br />
        <br />
        <div style={{ width: "80%", alignSelf: "center" }}>
          {this.state.pastApptExists === true ? pastApptTable : null}
          <br />
          <br />
        </div>
      </div>
    );
    if (this.state.isLoading) {
      content = <p>Is loading...</p>;
    }
    return <main>{content}</main>;
  }
}

export default PatientDashboardPage;