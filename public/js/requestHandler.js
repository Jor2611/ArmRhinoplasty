$(document).ready(function() {
  let signUpForm = $("#signUpForm");
  let signInForm = $("#signInForm");

  //============Sign In Form Validation============//
  signInForm.validate({
    rules: {
      email: {
        required: true,
        email: true
      },
      dassword: {
        minlength: 6,
        required: true
      }
    },
    highlight: function(element) {
      $(element)
        .closest(".control-group")
        .removeClass("success")
        .addClass("error");
    },
    success: function(element) {
      element
        .addClass("valid")
        .closest(".control-group")
        .removeClass("error")
        .addClass("success");
    }
  });

  //===========End Sign In Validation============//

  //=====Sign In Form Submition======//

  signInForm.submit(function(e) {
    let formData = {
      email: $("input[name=email]").val(),
      dassword: $("input[name=dassword]").val()
    };

    $.ajax({
      type: "POST", // define the type of HTTP verb we want to use (POST for our form)
      url: "/auth/authenticate", // the url where we want to POST
      data: formData, // our data object
      dataType: "json", // what type of data do we expect back from the server
      encode: true
    })
      // using the done promise callback
      .done(function(data) {
        if (data.success) {
          location.reload();
        } else {
          console.log(data.msg);
        }
      });
    e.preventDefault();
  });
  //============End Sign Up Form Submition==========//

  //============Sign Up Form Validation============//
  signUpForm.validate({
    // errorElement: "div",
    rules: {
      firstName: {
        minlength: 2,
        required: true
      },
      lastName: {
        minlength: 3,
        required: true
      },
      _email: {
        required: true,
        email: true
      },
      dob: {
        required: true,
        date: true
      },
      _nationality: {
        required: true
      },
      academic_degree: {
        required: true
      },
      _discipline: {
        required: true
      },
      _phone: {
        minlength: 6,
        maxlength: 15,
        required: true
      },
      m_phone: {
        minlength: 6,
        maxlength: 15,
        required: true
      },
      _fax: {
        minlength: 6,
        maxlength: 15,
        required: true
      },
      bus_address: {
        required: true
      },
      p_address: {
        required: true
      },
      _password: {
        minlength: 6,
        required: true
      },
      _confirm: {
        minlength: 6,
        equalTo: "#pwd",
        required: true
      },
      _practice: {
        required: true
      },
      _member: {
        required: true
      },
      _agree: {
        required: true
      }
    },
    errorPlacement: function(error, element) {
      if (
        element.attr("name") === "_password" ||
        element.attr("name") === "_confirm"
      ) {
        error.insertAfter("#pass-group");
      } else {
        error.insertAfter(element);
      }
    },
    highlight: function(element) {
      $(element)
        .closest(".control-group")
        .removeClass("success")
        .addClass("error");
    },
    success: function(element) {
      if (element.attr("for") === "pwd") {
        element.addClass("valid");
        $(".pwd_group")
          .removeClass("error")
          .addClass("success");
      } else if (element.attr("for") === "confirm") {
        element.addClass("valid");
        $(".confirm_group")
          .removeClass("error")
          .addClass("success");
      } else {
        element
          .addClass("valid")
          .closest(".control-group")
          .removeClass("error")
          .addClass("success");
      }
    }
  });

  //===========End Sign Up Validation============//

  //============Sign Up Form Submition=============//
  signUpForm.submit(function(e) {
    let degree = $("select[name=academic_degree]").val();
    switch (degree) {
      case "1":
        degree = "Bachelor";
        break;
      case "2":
        degree = "Master";
        break;
      case "3":
        degree = "Doctorate";
        break;
      default:
        degree = "Professorship";
        break;
    }
    if (signUpForm.valid()) {
      let formData = {
        firstName: $("input[name=firstName]").val(),
        lastName: $("input[name=lastName]").val(),
        email: $("input[name=_email]").val(),
        date_of_birth: $("input[name=dob]").val(),
        nationality: $("input[name=_nationality]").val(),
        academic_degree: degree,
        occupation_discipline: $("input[name=_discipline]").val(),
        phone: $("input[name=_phone]").val(),
        mobile_phone: $("input[name=m_phone]").val(),
        fax: $("input[name=_fax]").val(),
        business_address: $("input[name=bus_address]").val(),
        private_address: $("input[name=p_address]").val(),
        practice_details: $("input[name=_practice]").val(),
        member_type: $("input[name=_member]").val(),
        password: $("input[name=_password]").val(),
        confirm: $("input[name=_confirm]").val(),
        agreement: $("input[name=_agree]").val()
      };
      if (
        $("input[name=_password]").val() === $("input[name=_confirm]").val()
      ) {
        $.ajax({
          type: "POST", // define the type of HTTP verb we want to use (POST for our form)
          url: "/auth/register", // the url where we want to POST
          data: formData, // our data object
          dataType: "json", // what type of data do we expect back from the server
          encode: true
        })
          // using the done promise callback
          .done(function(data) {
            if (data.success) {
              console.log(data.msg);
              window.location.replace("/");
            } else {
              console.log(data.msg);
            }
          });
      } else {
        console.log("Passwords do not match");
      }
    } else {
      console.log("Please fill all fields");
    }

    e.preventDefault();
  });
  //============End Sign Up Form Submition=============//
});
