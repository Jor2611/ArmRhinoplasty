$(document).ready(function(e) {
  calendar = new CalendarYvv("#calendar", moment().format("Y-M-D"), "Monday");
  calendar.funcPer = function(ev) {
    console.log(ev);
  };
  console.log(calendar);
  calendar.diasResal = [4, 15, 26];
  calendar.createCalendar();
});
