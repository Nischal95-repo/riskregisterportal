$(".menu-icon").click(function() {
  $(".nav-section").toggleClass("expand");
  $(".main-section").toggleClass("expand");
});

$(".notifications, .notifications-close").click(function() {
  $(".notifications-section").toggleClass("expand");
});
$(".filter-btn").click(function() {
  $(".filter-popup").slideToggle();
});
$(document).ready(function() {
  var date_input = $(".date"); //our date input has the name "date"
  var container =
    $(".bootstrap-iso form").length > 0
      ? $(".bootstrap-iso form").parent()
      : "body";
  date_input.datepicker({
    format: "dd/mm/yyyy",
    container: container,
    todayHighlight: true,
    autoclose: true
  });
});
