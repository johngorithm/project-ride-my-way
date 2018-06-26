$(document).ready(function () {
  // TOGGLING NAVBAR ON SMALL SCREENS
  $('nav .navbar > p.navbar-toggle').on('click', function () {
    $('nav.navigation .navbar .nav-right').addClass('animate').toggle();
  });

  $(window).on('resize', function () {
    if ($(this).width() > 700) {
      $('nav.navigation .navbar .nav-right').css('display', 'block');
    } else if( $('nav.navigation .navbar .nav-right').css('display') == 'block') {
                $('nav.navigation .navbar .nav-right').css('display', 'none');
            }
  });

  // ADD OFFER FORM MODAL JS
  $('nav.navigation .navbar ul li.nav-item a[href="#"]').on('click', function (event) {
    event.preventDefault();
    $('.modal#add-offer-modal').css('display', 'block');
  });

  // ADD OFFER MODAL .close button
  $('.modal#add-offer-modal button.close').on('click', function (event) {
    event.preventDefault();
    $('.modal#add-offer-modal').css('display', 'none');
  });

  // ADD OFFER MODAL .create button
  $('.modal#add-offer-modal button.create').on('click', function (event) {
    event.preventDefault();
    // form validate
    let inputError = '';
    let destination = $('#add-offer-modal .modal-content form input[name=destination]');
    let time = $('#add-offer-modal .modal-content form input[name=time]');
    let date = $('#add-offer-modal .modal-content form input[name=date]');
    let takeOffVenue = $('#add-offer-modal .modal-content form input[name=takeoff_venue]');

    let formFields = [destination, time, date, takeOffVenue];
    let isAllProvided = true;
    formFields.forEach(function (field) {
      if (!field.val()) {
        if (field.attr('name') == 'destination') {
          inputError = 'destination is required!';
          field.prev().find('span').text(inputError);
        } else if (field.attr('name') == 'time') {
          inputError = 'time is required!';
          field.prev().find('span').text(inputError);
        } else if (field.attr('name') == 'date') {
          inputError = 'date is required!';
          field.prev().find('span').text(inputError);
        } else if (field.attr('name') == 'takeoff_venue') {
          inputError = 'takeoff venue is required!';
          field.prev().find('span').text(inputError);
        }
        isAllProvided = false;
      }else {
        field.prev().find('span').text('');
      }
    });

    if (isAllProvided) {
      $('#add-offer-modal .modal-content form p.success-message').text('YOUR RIDE OFFER IS SUCCESSFULLY CREATED!');
      return false;
    }
  });


  $('main.content .wrapper form button#login-btn').on('click', function (event) {
    event.preventDefault();
    let err = '';
    let errorOutput = $('.content .wrapper form p.error-message');
    let username = $('.content .wrapper form input[name=username]').val();
    let password = $('.content .wrapper form input[name=password]').val();

    if (!username && !password) {
      err = 'Username and Password are both required!';
      errorOutput.text(err);
    } else if (!username && password) {
      err = 'Username is required!';
      if (!(password.length >= 6)) {
        err = 'Username is required and Password is less than 6 characters';
      }
      errorOutput.text(err);
    } else if (!password && username) {
      err = 'Password is required!';
      errorOutput.text(err);
    } else if (username && password) {
      if (!(password.length >= 6)) {
        err = 'Password is less than 6 characters';
        errorOutput.text(err);
      }else {
        window.location.href = './home.html';
      }
    }
  });


  $('main.content .wrapper form button#register-btn').on('click', function (event) {
    event.preventDefault();

    let errorOutput = $('.content .wrapper form p.error-message');
    errorOutput.text = '';

    let fullname = $('.content .wrapper form input[name=fullname]');
    let phone = $('.content .wrapper form input[name=phone]');
    let email = $('.content .wrapper form input[name=email]');
    let username = $('.content .wrapper form input[name=username]');
    let password = $('.content .wrapper form input[name=password]');

    let fields = [fullname, phone, email, username, password];
    let allProvided = true;
    fields.forEach(function (field) {
      if (!field.val()) {
        field.prev().text('This field is require!');
        allProvided = false;
      } else if(field.attr('name') == 'password'){
                    if(!(field.val().length >= 6)){
                        field.prev().text('Password must be at least 6 characters!');
                        allProvided = false;
                    }
                }else{
                    field.prev().text('');
                }
    });

    if (allProvided) {
      window.location.href = './home.html';
    }
  });

  let rideDetailModal = $('.modal#detail-modal');

  $('.tile .tile-footer button.view').on('click', function (e) {
    let info = $(this).data('ride-info');

    $('.modal#detail-modal .modal-content .tile .tile-heading h4 span').text(info.destination).css('text-transform', 'uppercase');
    $('.modal#detail-modal .modal-content .tile .tile-heading p span').text(info.from);
    $('.modal#detail-modal .modal-content .tile .tile-body .row p.date').text(info.date);
    $('.modal#detail-modal .modal-content .tile .tile-body .row p.time').text(info.time);
    $('.modal#detail-modal .modal-content .tile .tile-body.not-first p.driver').text(info.driver);

    // clear old message
    $('.modal#detail-modal .modal-content .tile .tile-heading span.message').text('');

    rideDetailModal.css('display', 'block');
  });

  // closing the ride detail modal on clicking the modal overlay
  $(window).click(function (event) {
    let target = $(event.target);

    if (target.is('#detail-modal')) {
      rideDetailModal.css('display', 'none');
    }
  });

  // closing the modal with the .close button
  $('.modal#detail-modal .modal-content .tile .tile-footer button.close').on('click', function (event) {
    $('.modal#detail-modal').css('display', 'none');
  });

  $('.modal#detail-modal .modal-content .tile .tile-footer button.join').on('click', function () {
    $('.modal#detail-modal .modal-content .tile .tile-heading span.message').text('REQUEST SENT');
  });

  $('.inner-container div button.accept-btn').on('click', function () {
    $(this).text('ACCEPTED').attr('disabled', 'disabled').css({
    	'background':'rgb(7, 199, 7)',
    	'cursor': 'default',
    	'color': 'white',
    }).removeClass('button-blue').on('hover', function() {
    	this.css('border', '1px solid transparent');
    });
  });


  // USING THE REJECT BUTTON FOR REQUESTS
  $('.inner-container div button.reject-btn').on('click', function (event) {
    let passenger = $(this).parent().prev().children()
.children()
.html();

    let status = $(this).prev().text();

    if (status == 'ACCEPTED') {
      var responseHtml = '<p class="error-message">Sorry, You have already accepted this ride';
      $('#reject-ride-request-modal .modal-content .tile .tile-body').html(responseHtml);
      $('#reject-ride-request-modal .modal-content .tile .tile-footer button.reject-btn').hide();
      $('#reject-ride-request-modal').css('display', 'block');
    }else {
      let requestId = $(this).parent().parent().attr('id');
      var responseHtml = '<p class="confirm-msg small">Are you sure you want to REJECT a ride request from <span>John</span> </p> <p class="error-message smaller"></p>';
      $('#reject-ride-request-modal .modal-content .tile .tile-body').html(responseHtml);
      $('#reject-ride-request-modal .modal-content .tile .tile-footer button.reject-btn').show().data('request_id', requestId);
      $('#reject-ride-request-modal .modal-content .tile .tile-body p span').text(passenger);
      $('#reject-ride-request-modal').css('display', 'block');
    }
  });

  // REMOVING THE REJECT MODAL POP ON WINDOW CLICK
  $(window).click(function (event) {
    let target = $(event.target);

    if (target.is('#reject-ride-request-modal')) {
      $('#reject-ride-request-modal').css('display', 'none');
    }
  });

  // close button for #reject-ride-request-modal
  $('.modal#reject-ride-request-modal .modal-content .tile .tile-footer button.close').on('click', function (event) {
    $('.modal#reject-ride-request-modal').css('display', 'none');
  });

  // CONFIRMED REJECTION ACTION
  $('.modal#reject-ride-request-modal .modal-content .tile .tile-footer button.reject-btn').on('click', function () {
    let requestId = $(this).data('request_id');
    $(`.inner-container#${requestId}`).css('display', 'none');
    $('.modal#reject-ride-request-modal .modal-content .tile .tile-body p.error-message').text('RIDE REJECTED');
    setTimeout(function () {
      $('.modal#reject-ride-request-modal').css('display', 'none');
    }, 2000);
  });
});
