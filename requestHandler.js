$(document).ready(function(){
    let signUpForm = $('#signUpForm');
    let signInForm = $('#signInForm');


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
        highlight: function (element) {
            $(element).closest('.control-group').removeClass('success').addClass('error');
        },
        success: function (element) {
            element.addClass('valid')
                .closest('.control-group').removeClass('error').addClass('success');
        }
    });

    //===========End Sign In Validation============//


    //=====Sign In Form Submition======//

    signInForm.submit(function(e){
        let formData = {
            'email': $('input[name=email]').val(),
            'dassword': $('input[name=dassword]').val()
        };

        $.ajax({
            type        : 'POST', // define the type of HTTP verb we want to use (POST for our form)
            url         : '/auth/authenticate', // the url where we want to POST
            data        : formData, // our data object
            dataType    : 'json', // what type of data do we expect back from the server
                        encode          : true
        })
            // using the done promise callback
            .done(function(data) {
                if(data.success){
                    location.reload();
                }else{
                    console.log(data.msg);
                } 
            });
            e.preventDefault(); 
    });
    //============End Sign Up Form Submition==========//

    //============Sign Up Form Validation============//
    signUpForm.validate({
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
            _password: {
                minlength: 6,
                required: true
            },
            _confirm: {
                minlength: 6,
                equalTo: "#pwd",
                required: true
            }
        },
        highlight: function (element) {
            $(element).closest('.control-group').removeClass('success').addClass('error');
        },
        success: function (element) {
            element.addClass('valid')
                .closest('.control-group').removeClass('error').addClass('success');
        }
    });

    //===========End Sign Up Validation============//



    //============Sign Up Form Submition=============//
    signUpForm.submit(function(e){
       if(signUpForm.valid()){
         let formData = {
            'firstName': $('input[name=firstName]').val(),
            'lastName': $('input[name=lastName]').val(),
            'email': $('input[name=_email]').val(),
            'password': $('input[name=_password]').val(),
            'confirm': $('input[name=_confirm]').val()
         };
         if($("input[name=_password]").val()===$("input[name=_confirm]").val()){
            $.ajax({
                type        : 'POST', // define the type of HTTP verb we want to use (POST for our form)
                url         : '/auth/register', // the url where we want to POST
                data        : formData, // our data object
                dataType    : 'json', // what type of data do we expect back from the server
                            encode          : true
            })
                // using the done promise callback
                .done(function(data) {
                    if(data.success){
                        console.log(data.msg);
                        window.location.replace('/');
                    }else{
                        console.log(data.msg);
                    }
                });
         }else{
            console.log("Passwords do not match");
         }
       }else{
        console.log("Please fill all fields");
       }
        
            e.preventDefault();
    });
    //============End Sign Up Form Submition=============//
});