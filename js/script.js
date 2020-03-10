// https://teamtreehouse.com/projects/interactive-form

/*****************************************
Set focus on the first text field
*****************************************/
const firstTextField = document.querySelector('form input');

firstTextField.focus();

/*****************************************
”Job Role” section
*****************************************/
const jobRoleSelect = document.querySelector('form select#title'),
    jobRoleOptions = jobRoleSelect.querySelectorAll('option'),
    jobRoleTextField = document.querySelector('#other-field');

jobRoleTextField.style.display = "none";

jobRoleSelect.addEventListener("change", event => {
    jobRoleOptions.forEach(option => {
        if (option.selected && option.text === "Other") {
            jobRoleTextField.style.display = "block";
        } else {
            jobRoleTextField.style.display = "none";
        }
    })
})

/*****************************************
”T-Shirt Info” section
*****************************************/
const designSelect = document.querySelector('form select#design'),
    designOptions = designSelect.querySelectorAll('option'),
    colorSelect = document.querySelector('form select#color'),
    colorSection = colorSelect.parentNode,
    colorOptions = colorSelect.querySelectorAll('option'),
    newOption = document.createElement('option');

function resetColorSelect() {
    colorSelect[0].text = "Select color";
    colorSelect.selectedIndex = 0;
    if (designSelect.selectedIndex == 0) {
        colorSection.style.display = "none";
    } else {
        colorSection.style.display = "inherit";
    }
}

function filterColorOptions(text, removeText, removeChars) {
    const regexTxt = new RegExp(removeText),
        regexChars = new RegExp(removeChars),
        string = text.replace(regexTxt, ''),
        result = string.replace(regexChars, '');

    colorOptions.forEach(option => {
        if (!option.text.includes(result)) {
            // Disable for Safari
            option.disabled = true;
            // Hide for all compatible browsers
            option.hidden = true;
        } else {
            option.disabled = false;
            option.hidden = false;
        };
    })
}

colorSelect.prepend(newOption);
resetColorSelect();

designSelect.addEventListener("change", event => {
    let i = event.target.selectedIndex;

    resetColorSelect();
    filterColorOptions(designOptions[i].text, 'Theme', ' - ');
})

/*****************************************
”Register for Activities” section
*****************************************/
let amountCosts = 0,
    currency = '$',
    totalCosts = document.createElement('p');
const activityField = document.querySelector('.activities'),
    allCheckBoxes = activityField.querySelectorAll('input[type="checkbox"]');

// add total in HTML
totalCosts.innerHTML = 'Total costs:<span class="total-costs">' + currency + amountCosts + '</span>';
activityField.append(totalCosts);

allCheckBoxes.forEach(checkBox => {
    let dayAndTime = checkBox.dataset.dayAndTime,
        cost = checkBox.dataset.cost;

    checkBox.addEventListener("change", event => {
        let pickedActivity = event.target,
            pickedDate = pickedActivity.dataset.dayAndTime,
            pickedCost = pickedActivity.dataset.cost;

        //check each checkbox
        allCheckBoxes.forEach(checkBox => {
            //get date and compare dataset siblings    
            if (pickedDate && checkBox.dataset.dayAndTime == pickedDate) {
                //unchecked?
                if (!checkBox.checked && pickedActivity.checked) {
                    // style siblings as disabled
                    checkBox.parentNode.style.color = 'rgba(0,0,0,0.35)';
                    checkBox.disabled = true;
                    // disabled?
                } else if (checkBox.disabled && !pickedActivity.checked) {
                    // keep or style all as default    
                    checkBox.parentNode.style.color = 'inherit';
                    checkBox.disabled = false;
                }
            }
        });

        if (cost && pickedActivity.checked) {
            amountCosts += parseInt(pickedCost);
        } else if (cost && !pickedActivity.checked) {
            amountCosts -= parseInt(pickedCost);
        }

        document.querySelector('.total-costs').innerText = currency + amountCosts;
    })
});

/*****************************************
Payment Info" section
*****************************************/
const selectPayment = document.querySelector('select#payment'),
    paymentMethodOption = selectPayment.querySelector('[value^="select"]'),
    paymentCredit = document.querySelector('#credit-card'),
    paymentPaypal = document.querySelector('#paypal'),
    paymentBitcoin = document.querySelector('#bitcoin');

paymentMethodOption.disabled = true;

paymentPaypal.style.display = 'none';
paymentBitcoin.style.display = 'none';

selectPayment.addEventListener('change', () => {
    paymentCredit.style.display = 'none';
    paymentPaypal.style.display = 'none';
    paymentBitcoin.style.display = 'none';

    if (selectPayment.selectedIndex == 1) {
        paymentCredit.style.display = 'inherit';
    } else if (selectPayment.selectedIndex == 2) {
        paymentPaypal.style.display = 'inherit';
    } else if (selectPayment.selectedIndex == 3) {
        paymentBitcoin.style.display = 'inherit';
    }
});

selectPayment.selectedIndex = 1;
console.log(selectPayment.selectedIndex);
/*****************************************
Form validation
*****************************************/
const nameField = document.querySelector('input#name'),
    emailField = document.querySelector('input#mail'),
    submitButton = document.querySelector('button[type="submit"'),
    creditCardNumber = document.querySelector('input#cc-num'),
    zipCode = document.querySelector('input#zip'),
    cvv = document.querySelector('input#cvv');

function validateName() {
    const regex = /^\D+\s?\w*$/i;

    return regex.test(nameField.value);
}

function validateEmail() {
    const regex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/i;

    return regex.test(emailField.value);
}

// Validate activities
function validateActivities() {
    for (let i = 0; i < allCheckBoxes.length; i++) {
        if (allCheckBoxes[i].checked) {
            return true;
        }
    }
}

function validateCreditCardName() {
    const regex = /^\d{13,16}$/i;

    return regex.test(creditCardNumber.value);
}

function validateZip() {
    const regex = /^\d{5}$/i;

    return regex.test(zipCode.value);
}

function validateCvv() {
    const regex = /^\d{3}$/i;

    return regex.test(cvv.value);
}

function toggleError(validation, element, message) {
    validation ? element.classList.remove('error') : element.classList.add('error');
    errorMessage(validation, element, message);
}

function errorMessage(validation, element, message) {
    const p = document.createElement('p'),
        sibling = element.nextElementSibling,
        errorClass = 'error-message',
        createMessage = (message) => {
            if (element.value === '') {
                p.innerText = 'This field cannot be empty.';
            } else {
                p.innerText = message;
            }
        };

    p.classList.add(errorClass);

    if (sibling) {
        if (!validation && !sibling.classList.contains(errorClass)) {
            element.parentNode.insertBefore(p, sibling);
            createMessage(message);
        } else if (validation && sibling.classList.contains(errorClass)) {
            // remove message
            element.parentNode.removeChild(sibling);
        }
    } else {
        if (!validation) {
            element.parentNode.appendChild(p);
            createMessage(message);
        } else if (validation) {
            // remove message
            element.parentNode.removeChild(sibling);
        }
    }
}

// Validate namefield
nameField.addEventListener('blur', () => {
    toggleError(validateName(), nameField);
});

// Validate emailfield
emailField.addEventListener('input', () => {
    toggleError(validateEmail(), emailField, 'Please provide a valid email address.');
});
emailField.addEventListener('blur', () => {
    toggleError(validateEmail(), emailField, 'Please provide a valid email address.');
});
    

// Validate credit card number
creditCardNumber.addEventListener('blur', () => {
    toggleError(validateCreditCardName(), creditCardNumber, 'Please provide a number between 13 and 16 characters.');
});

// Validate zip code
zipCode.addEventListener('blur', () => {
    toggleError(validateZip(), zipCode, 'Please provide 5 numbers.');
});

// Validate zip code
cvv.addEventListener('blur', () => {
    toggleError(validateCvv(), cvv, 'Please provide 3 numbers.');
});

submitButton.addEventListener('click', event => {
    event.preventDefault();
    toggleError(validateName(), nameField);
    toggleError(validateEmail(), emailField);
    toggleError(validateActivities(), activityField, 'Select at least 1 activity.');
    toggleError(validateCreditCardName(), creditCardNumber);
    toggleError(validateZip(), zipCode);
    toggleError(validateCvv(), cvv);
});

/*
Add good code comments
*/


/*****************************************
EXCEEDS PART
******************************************/

/*Real-time Error Messages
Program your form so that it provides a real-time validation error message for at least one text input field. Rather than providing an error message on submit, your form should check for errors and display messages as the user begins typing inside a text field. For example, if the user enters an invalid email address, the error appears as the user begins to type, and disappears as soon as the user has entered a complete and correctly formatted email address. You must accomplish this with your own JavaScript code. Do not rely on HTML5's built-in email validation.
NOTE: If you implement the above exceeds requirements in your form, make sure you detail in your submission notes which input will have different error messages depending on the error, and which input will have "real time" validation messages, so your reviewer won't miss them by accident.
*/

/*
NOTE: Getting an "Exceed Expectations" grade.

See the rubric in the "How You'll Be Graded" tab above for details on what you need to receive an "Exceed Expectations" grade.
Passing grades are final. If you try for the "Exceeds Expectations" grade, but miss an item and receive a “Meets Expectations” grade, you won’t get a second chance. Exceptions can be made for items that have been misgraded in review.
Always mention in the comments of your submission or any resubmission, what grade you are going for. Some students want their project to be rejected if they do not meet all Exceeds Expectations Requirements, others will try for all the "exceeds" requirement but do not mind if they pass with a Meets Expectations grade. Leaving a comment in your submission will help the reviewer understand which grade you are specifically going for
*/