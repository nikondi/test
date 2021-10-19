function validate(form, submit = false) {
    let errors = {};
    $('.inner-error').remove();
    $(form).find('input').removeClass('error');

    let login = form.querySelector('#form-input-login');
    if(login.dataset.changed || submit) {
        if (login.value == '')
            errors['login'] = 'Заполните поле';
        else if (!(/^[a-zA-Z0-9]+$/).test(login.value))
            errors['login'] = 'Неправильный формат логина';
        else if (login.value.length < 6)
            errors['login'] = 'Длина логина должна быть более 6 символов';
    }

    let email = form.querySelector('#form-input-email');
    if(email.dataset.changed || submit) {
        if (email.value == '')
            errors['email'] = 'Заполните поле';
        else if (!(/^[-\w.]+@([A-z0-9][-A-z0-9]+\.)+[A-z]{2,4}$/).test(email.value))
            errors['email'] = 'Проверьте введёный email';
    }

    let phone = form.querySelector('#form-input-phone');
    if(phone.dataset.changed || submit) {
        if (phone.value == '')
            errors['phone'] = 'Заполните поле';
        else if (!(/\+7[\s(]*\d{3}[)\s]*\d{3}[\s-]?\d{2}[\s-]?\d{2}/).test(phone.value))
            errors['phone'] = "Неверный формат номера телефона";
    }

    let pass = form.querySelector('#form-input-password');
    let pass2 = form.querySelector('#form-input-password2');
    if(pass.dataset.changed || pass2.dataset.changed || submit) {
        if (pass.value == '')
            errors['password'] = 'Заполните поле';
        else if (pass2.value == '')
            errors['password2'] = 'Заполните поле';
        else if (pass.value.length < 8)
            errors['password'] = 'Пароль должен быть больше 8 символов';
        else if (pass.value != pass2.value)
            errors['password2'] = 'Пароли не совпадают';
    }

    if(Object.keys(errors).length != 0) {
        for(let error in errors) {
            form.querySelector('#form-input-'+error).classList.add('error');
            $(form).find('#form-input-'+error).closest('.form-label').append('<span class="inner-error">'+errors[error]+'</span>');
        }

        return false;
    }
    return true;
}

function showMain(user) {
    $('.form').toggleClass('active');
    $('.user-login').text(user.login);
}
function showReg() {
    $('.form').toggleClass('active');
}

$(document).ready(function() {
    if(window.localStorage.getItem('user'))
        showMain(JSON.parse(window.localStorage.getItem('user')));

    $('.show-password').click(function(e) {
        e.preventDefault();
        $(this).toggleClass('active');

        let input = $(this).parent().find('.form-input-password');
        if(input.is('[type="password"]'))
            input.attr('type', 'text');
        else if(input.is('[type="text"]'))
            input.attr('type', 'password');
    });

    document.getElementById('form-input-phone').addEventListener('focus', function (e) {
        if(this.value == '')
            this.value = '+7 (___) ___-__-__';
    });
    document.getElementById('form-input-phone').addEventListener('blur', function (e) {
        if(this.value == '+7 (___) ___-__-__')
            this.value = '';
    });
    let curp;
    document.getElementById('form-input-phone').addEventListener('keyup', function (e) {
        var x = e.target.value.replace(/\D/g, '').match(/(\d)?(\d)?(\d)?(\d)?(\d)?(\d)?(\d)?(\d)?(\d)?(\d)?(\d)?/);
        curp = e.target.selectionStart;

        e.target.value = '+7 (' + (x[2]||'_') + (x[3]||'_') + (x[4]||'_') + ') ' + (x[5]||'_') + (x[6]||'_') + (x[7]||'_') + '-' + (x[8]||'_') + (x[9]||'_') + '-' + (x[10]||'_') + (x[11]||'_');
        e.target.setSelectionRange(e.target.value.indexOf('_'), e.target.value.indexOf('_'));


    });

    $('.form.form-reg input').on('focus', function() {
        $(this).attr('data-changed', true);
    })
    $('.form.form-reg input').on('blur', function() {
        validate($(this).closest('.form-reg')[0]);
    })
    $('.form.form-reg').submit(function(e) {
        e.preventDefault();

        console.log(validate(this, true));
        if(validate(this, true)) {
            let user = {
                'login': $('#form-input-login').val(),
                'email': $('#form-input-email').val(),
                'password': $('#form-input-password').val(),
                'phone': $('#form-input-phone').val()
            };
            window.localStorage.setItem('user', JSON.stringify(user));

            showMain(user);
        }

        return false;
    });
    $('.form-button.logout').click(function() {
        $('.form.form-reg input').val('');
        window.localStorage.removeItem('user');
        showReg();
    });
});