/* STUDENTS IGNORE THIS FUNCTION
 * All this does is create an initial
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
$(function() {
    
    // MODEL
    var model = {
      attendance: JSON.parse(localStorage.attendance)
    };
  
    
    // CTRLR
    var octopus = {
      update: function(data) {
        localStorage.attendance = JSON.stringify(data);
      },
      
      init: function() {
        view.init();
      }
    };

    
    // VIEW
    var view = {
      init: function() {
        this.render();
      },
      
      countMissing: function() {
        var $allMissed = $('tbody .missed-col');
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
      },
      
      render: function() {
        // Check boxes, based on attendace records
        $.each(model.attendance, function(name, days) {
            var studentRow = $('tbody .name-col:contains("' + name + '")').parent('tr'),
                dayChecks = $(studentRow).children('.attend-col').children('input');

            dayChecks.each(function(i) {
                $(this).prop('checked', days[i]);
            });
        });

        // When a checkbox is clicked, update localStorage
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

            view.countMissing();
            octopus.update(newAttendance);
        });
        
        view.countMissing();
      }

    };

    octopus.init();
    
}());