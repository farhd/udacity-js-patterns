/* STUDENT APPLICATION */
$(function() {

    // MODEL
    var model = {
      days: 12,
      names: ['Slappy the Frog',
              'Lilly the Lizard',
              'Paulrus the Walrus',
              'Gregory the Goat',
              'Adam the Anaconda'],
      attendance: JSON.parse(localStorage.attendance)
    };


    // CTRLR
    var octopus = {
      createInitialData: function() {
        console.log('Creating attendance records...');
        function getRandom() {
            return (Math.random() >= 0.5);
        }

        var attendance = {};

        model.names.map(function(name) {
            attendance[name] = [];

            for (var i = 0; i <= model.days; i++) {
                attendance[name].push(getRandom());
            }
        });

        localStorage.attendance = JSON.stringify(attendance);
      },

      update: function(data) {
        localStorage.attendance = JSON.stringify(data);
      },

      getNames: function() { return model.names; },
      getHistory: function() { return model.attendance; },
      getNrOfDays: function() { return model.days; },
      setHistory: function(attrs) {
        var student = attrs.name;
        var day = attrs.inputIndex;
        var attended = attrs.checkVal;
        this.getHistory()[student][day] = attended;
        console.log(this.getHistory()[student][day]);
      },

      init: function() {
        if (!localStorage.attendance) {
          this.createInitialData();
        }

        view.init();
      }
    };


    // VIEW
    var view = {
      init: function() {
        this.render();
      },

      render: function() {
        var names = octopus.getNames();
        var history = octopus.getHistory();
        var studentHistory = history[octopus.getNames()[0]];

        var countMissing = function(name) {
          return octopus.getHistory()[name].filter(function(val) {
            return !val;
          })
            .length;
        };

        // Template
        function studentTpl(attendanceHistory) {
          var studentHtml = '';
          attendanceHistory.map(function(day) {
            studentHtml += '<td class="attend-col"><input type="checkbox" ' + (day ? 'checked' : '') + '></td>';
          });

          return studentHtml;
        }

        function tableHeadTpl() {
          var html = '';
          html += '<thead><tr>';
          html += '<th class="name-col">Student Name</th>';
          for (var i = 1, days = octopus.getNrOfDays(); i <= days; i++) {
            html += '<th>'+ i +'</th>';
          }
          html += '<th class="missed-col">Days Missed</th>';
          html += '</tr></thead>';

          return html;
        }

        function tableBodyTpl() {
          var html = '';
          html += '<tbody>';
          names.map(function(name) {
            var currentHistory = history[name];
            html += '<tr class="student">';
            html += '<td class="name-col">'+name+'</td>';
            html += studentTpl(currentHistory);
            html += '<td class="missed-col">'+countMissing(name)+'</td>';
            html += '</tr>';
          });
          html += '</tbody>';

          return html;
        }

        function buildTable() {
          var html = '';
          html += '<table>';
          html += tableHeadTpl();
          html += tableBodyTpl();
          html += '</table>';

          $('body').append(html);

          $('tbody input').on('change', function() {
            var attrs = {};
            attrs.name = $(this).parent().siblings('.name-col').text();
            attrs.inputIndex = $(this).parent().index()-1;
            attrs.checkVal = $(this).prop('checked');
            //console.log(attrs);
            octopus.setHistory(attrs);

            $('table').remove();
            buildTable();
          });
        }

        buildTable();
      }

    };

    octopus.init();

});
