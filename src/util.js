const $ = window.$;

function selectDay(btnId) {
    var btnDay = document.getElementById(btnId);
    $(btnDay).toggleClass("daysBox daysBoxSelected");
}

// /* Formatting function for row details - modify as you need */
// function format ( d ) {
//     // `d` is the original data object for the row
//     return '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">'+
//         '<tr>'+
//             '<td>Doctor Phone Number:</td>'+
//             '<td>'+d.doctorPhone+'</td>'+
//         '</tr>'+
//         '<tr>'+
//             '<td>Doctor Total Experience:</td>'+
//             '<td>'+d.doctorTotalExperience+'</td>'+
//         '</tr>'+
//         '<tr>'+
//             '<td>Doctor Working Days:</td>'+
//             '<td>'+d.doctorWorkingDays+'</td>'+
//         '</tr>'+
//     '</table>';
// }

// // eslint-disable-next-line
// $(document).ready(function() {
//     // eslint-disable-next-line
//     var table = $('#tblFutureAppt').DataTable( {
//         "ajax": "../ajax/data/objects.txt",
//         "columns": [
//             {
//                 "className": 'details-control',
//                 "orderable": true,
//                 "data": null,
//                 "defaultContent": ''
//             },
//             { "data": "doctorId" },
//             { "data": "doctorName" },
//             { "data": "specialization" },
//             { "data": "appointmentDate" }
//         ],
//         "order": [[1, 'asc']]
//     });

//     // Add event listener for opening and closing details
//     // eslint-disable-next-line
//     $('#tblFutureAppt tbody').on('click', 'td.details-control', function () {
//         // eslint-disable-next-line
//         var tr = $(this).closest('tr');
//         var row = table.row( tr );

//         if ( row.child.isShown() ) {
//             // This row is already open - close it
//             row.child.hide();
//             tr.removeClass('shown');
//         }
//         else {
//             // Open this row
//             row.child( format(row.data()) ).show();
//             tr.addClass('shown');
//         }
//     });
// });

// // eslint-disable-next-line
// $(document).ready(function() {
//     // eslint-disable-next-line
//     $('#tblFutureAppt').DataTable();
//     // eslint-disable-next-line
//     $('#tblPastAppt').DataTable();
// });

// $("#btnGetDetails").on('click', function() {
// $(document).ready(function() {
//     $('#tblPastAppt').DataTable({
//         responsive: {
//             details: {
//                 type: 'column',
//                 target: 'tr'
//             }
//         }
//     });
//     $('#tblFutureAppt').DataTable({
//         responsive: {
//             details: {
//                 type: 'column',
//                 target: 'tr'
//             }
//         }
//     });
// });


// $('#tblPastAppt').on('click', 'td.details-control', function(){
//     $(this).closest('tbody').toggleClass('open');
// });

// $('#tblFutureAppt').on('click', 'td.details-control', function(){
//     $(this).closest('tbody').toggleClass('open');
// });


// function format(d) {
//     // `d` is the original data object for the row
//     return '<div style="padding:5%">'+
//         'Doctor Phone Number: ' + d.name +
//         'Doctor Total Experience: ' + d.name +
//         'Doctor Working Days: ' + d.name +
//         '</div';
// }

// $('#tblPastAppt tbody').on('click', 'td.details-control', function () {
//     var table = $('#tblPastAppt');
//     var tr = $(this).closest('tr');
//     var row = table.row(tr);

//     if (row.child.isShown()) {
//         row.child.hide();
//         tr.removeClass('shown');
//     }
//     else {
//         row.child(format(row.data())).show();
//         tr.addClass('shown');
//     }
// });

// $('#tblFutureAppt tbody').on('click', 'td.details-control', function () {
//     var table = $('#tblFutureAppt');
//     var tr = $(this).closest('tr');
//     var row = table.row(tr);

//     if (row.child.isShown()) {
//         // This row is already open - close it
//         row.child.hide();
//         tr.removeClass('shown');
//     }
//     else {
//         // Open this row
//         row.child(format(row.data())).show();
//         tr.addClass('shown');
//     }
// });