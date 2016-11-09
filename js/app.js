/* Creates an initial
 * attendance record if one is not found
 * within localStorage.
 */
(function() {
    if (!localStorage.attendance) {
        console.log('Creating attendance records...');
        function getRandom() {
            return (Math.random() >= 0.5);
        }

        var nameColumns = $('tbody .name-col'),
            attendance = {};

        nameColumns.each(function() {
            var name = this.innerText;
            attendance[name] = [];

            for (var i = 0; i <= 11; i++) {
                attendance[name].push(getRandom());
            }
        });

        localStorage.attendance = JSON.stringify(attendance);
    }
}());


/* STUDENT APPLICATION */

//Function for initializing the number of missed days, used in the model.
var calculateNumMissedDays = function() {
  var returnArray = [];
  var attendance = JSON.parse(localStorage.attendance);
  for (var i = 0; i < Object.keys(attendance).length; i++) {
    var name = Object.keys(attendance)[i];
    var record = attendance[name];
    //console.log(record);
    var numDaysMissed = 0;
    for (var j = 0; j < record.length; j++) {
      if (record[j] == false) {
        numDaysMissed++;
      }
    }
    //console.log(name + " missed " + numDaysMissed + " days");
    returnArray[i] = numDaysMissed;
  }
  return returnArray;
};

// Model

var model = {
  attendance: JSON.parse(localStorage.attendance),
  numMissedDays: calculateNumMissedDays()
};

// Controller

var controller = {
  //init
  init: function() {
    view.init();
  },

  //return model.attendance
  getAttendance: function() {
    return model.attendance;
  },

  //return model.numMissedDays
  getNumMissedDays: function() {
    return model.numMissedDays;
  },

  //calculate num missed days
  calculateNumMissedDays: function(newRecord) {
    for (var i = 0; i < Object.keys(newRecord).length; i++) {
      var name = Object.keys(newRecord)[i];
      var record = newRecord[name];
      //console.log(record);
      var numDaysMissed = 0;
      for (var j = 0; j < record.length; j++) {
        if (record[j] == false) {
          numDaysMissed++;
        }
      }
      //console.log(name + " missed " + numDaysMissed + " days");
      model.numMissedDays[i] = numDaysMissed;
    }
    //console.log(model.numMissedDays);
    return model.numMissedDays;
  },

  //Update the model and view once a click event has happened
  updateAttendance: function(newRecord) {
    model.attendance = newRecord;
    view.init();
  }
};

// View

var view = {
  init: function() {

    // Check boxes, based on attendance records
    var attendance = controller.getAttendance();
    $.each(attendance, function(name, days) {
        var studentRow = $('tbody .name-col:contains("' + name + '")').parent('tr'),
            dayChecks = $(studentRow).children('.attend-col').children('input'),
            missedCol = $(studentRow).children('.missed-col');

        dayChecks.each(function(i) {
          //.prop( propertyName, value ) Sets one or more properties for the set of matched elements.
            $(this).prop('checked', days[i]);
        });
    });

    //display num missed days
    $allMissed = $('tbody .missed-col');
    var missedDaysArray = controller.getNumMissedDays();
    $allMissed.each(function(i) {
      $(this).text(missedDaysArray[i]);
    })

    //event listener for checking boxes
    $allCheckboxes = $('tbody input');
    $allCheckboxes.on('click', function() {
        var studentRows = $('tbody .student'),
            newAttendance = {};

        studentRows.each(function() {
            var name = $(this).children('.name-col').text(),
                $allCheckboxes = $(this).children('td').children('input');

            newAttendance[name] = [];

            $allCheckboxes.each(function() {
                newAttendance[name].push($(this).prop('checked'));
            });
        });

        controller.calculateNumMissedDays(newAttendance);
        controller.updateAttendance(newAttendance);
    });
  }
}
controller.init();

//Below is the original code:
/*
$(function() {
    var attendance = JSON.parse(localStorage.attendance),
        $allMissed = $('tbody .missed-col'),
        $allCheckboxes = $('tbody input');

    // Count a student's missed days
    function countMissing() {
        $allMissed.each(function() {
            var studentRow = $(this).parent('tr'),
                dayChecks = $(studentRow).children('td').children('input'),
                numMissed = 0;

            dayChecks.each(function() {
                if (!$(this).prop('checked')) {
                    numMissed++;
                }
            });

            $(this).text(numMissed);
        });
    }

    // Check boxes, based on attendace records
    $.each(attendance, function(name, days) {
        var studentRow = $('tbody .name-col:contains("' + name + '")').parent('tr'),
            dayChecks = $(studentRow).children('.attend-col').children('input');

        dayChecks.each(function(i) {
            $(this).prop('checked', days[i]);
        });
    });

    // When a checkbox is clicked, update localStorage
    $allCheckboxes.on('click', function() {
        var studentRows = $('tbody .student'),
            newAttendance = {};

        studentRows.each(function() {
            var name = $(this).children('.name-col').text(),
                $allCheckboxes = $(this).children('td').children('input');

            newAttendance[name] = [];

            $allCheckboxes.each(function() {
                newAttendance[name].push($(this).prop('checked'));
            });
        });

        countMissing();
        localStorage.attendance = JSON.stringify(newAttendance);
    });

    countMissing();
}());
*/
