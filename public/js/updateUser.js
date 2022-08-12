const signupForm = document.querySelector('form');
const errMsg = document.querySelector('#errorMsg');
const submitBtn = document.querySelector('#submit');
const logOutBtn = document.querySelector('#logOut');
const logOutAllBtn = document.querySelector('#logOutAll');
const deleteButton = document.querySelector('#deleteProfile');
const successAlert = document.querySelector('#alertS');

signupForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = document.querySelector('#inputName').value;
    const email = document.querySelector('#inputEmail').value;
    const gender = document.querySelector('#inputGender').value;
    const dob = document.querySelector('#dob').value;
    const password = document.querySelector('#inputPassword').value;

    submitBtn.innerHTML = 'Updating...';

    const formData = {
            name,
            email,
            gender,
            dob
    };

    let passwordChanged = false;
    let passwordChangedSuccess = false;

    if(password !== ''){
        passwordChanged = true;

        if(password.length <= 7){
            errMsg.innerHTML = 'Password must contain more than 8 characters.';
            submitBtn.innerHTML = 'Update';
            return;
        }

        const passwordOk = checkPassword(password);

        if(passwordOk !== ''){
            errMsg.innerHTML = passwordOk;
            submitBtn.innerHTML = 'Update';
        }else{
            passwordChangedSuccess = true;
        }
    }

    if(passwordChanged && passwordChangedSuccess){
        formData.password = password;
        console.log(formData);
        fetch('/update', {
            method: 'PATCH',
            body: JSON.stringify(formData),
            headers: {
                "Content-Type": "application/json; charset=UTF-8"
            }
        }).then((response) => {
            if(response.status === 400){
                    errMsg.innerHTML = 'Some Error Occurred!';
                    submitBtn.innerHTML = 'Update';
            }else if(response.status === 401){
                window.location.reload();
            }else if(response.status === 200){
                window.location = '/success?task=Updated&updated=true';
            }
        });
    }else if(!passwordChanged){
        console.log(formData);
        fetch('/update', {
            method: 'PATCH',
            body: JSON.stringify(formData),
            headers: {
                "Content-Type": "application/json; charset=UTF-8"
            }
        }).then((response) => {
            if(response.status === 400){
                    errMsg.innerHTML = 'Some Error Occurred!';
                    submitBtn.innerHTML = 'Update';
            }else if(response.status === 401){
                window.location.reload();
            }else if(response.status === 200){
                window.location = '/success?task=Updated&updated=true';
            }
        });
    }
});

logOutBtn.addEventListener('click', () => {
    fetch('/logout', {
        method: 'POST'
    }).then((response) => {
        if(response.status === 200)
            window.location = '/';
        else{
            errMsg.innerHTML = 'Some Error Occurred!';
            window.location.reload();
        }
    });
});

logOutAllBtn.addEventListener('click', () => {
    fetch('/logoutall', {
        method: 'POST'
    }).then((response) => {
        if(response.status === 200)
            window.location = '/';
        else{
            errMsg.innerHTML = 'Some Error Occurred!';
            window.location.reload();
        }
    });
});

deleteButton.addEventListener('click', () => {
    fetch('/deletePro', {
        method: 'DELETE'
    }).then((response) => {
        if(response.status === 200)
            window.location = '/success?task=Deleted';
        else{
            errMsg.innerHTML = 'Some Error Occurred!';
            window.location.reload();
        }
    });
});

const checkPassword = (password) => {

    let errorMessage = '';
    const upperCase = new RegExp("(?=.*[A-Z])");
    const number = new RegExp("(?=.*[0-9])");
    const specialChar = new RegExp("(?=.*[!@#$%^&*])");

    if(password.toLowerCase().includes('password')){
        errorMessage += ' Password cannot contain "password".';
    }

    if(!upperCase.test(password)){
        errorMessage += ' Password must contain atleast 1 upper case character.'
    }

    if(!number.test(password)){
        errorMessage += ' Password must contain atleast 1 numerical character.'
    }

    if(!specialChar.test(password)){
        errorMessage += ' Password must contain atleast 1 special character.'
    }

    return errorMessage;
};