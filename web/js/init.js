(function ($) {
    $(function () {

        $('.button-collapse').sideNav();

    }); // end of document ready
})(jQuery); // end of jQuery name space

$(document).ready(function () {
    // initialize the slider in side-nav
    $('.slider').slider();
    // initialize nice scroll
    $("html").niceScroll();
    $(".side-progress-section").niceScroll({cursoropacitymin: .2});


});


