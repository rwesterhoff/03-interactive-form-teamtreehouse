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

// Show or hide job role field.
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

// Reset color select to display 1st option and show or hide color select based on design selected.
function resetColorSelect() {
    colorSelect[0].text = "Select color";
    colorSelect.selectedIndex = 0;

    if (designSelect.selectedIndex == 0) {
        colorSection.style.display = "none";
    } else {
        colorSection.style.display = "inherit";
    }
}

// Show and hide color options based on selected design.
function filterColorOptions(text, removeText, removeChars) {
    const regexTxt = new RegExp(removeText),
        regexChars = new RegExp(removeChars),
        string = text.replace(regexTxt, ''),
        result = string.replace(regexChars, '');

    colorOptions.forEach(option => {
        if (!option.text.includes(result)) {
            // Disable for Safari.
            option.disabled = true;
            // Hide for all compatible browsers.
            option.hidden = true;
        } else {
            option.disabled = false;
            option.hidden = false;
        };
    })
}

// Initialize 1st option with instructions and reset.
colorSelect.prepend(newOption);
resetColorSelect();

// Add upper functionality to design select.
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

// Add total costs in HTML.
totalCosts.innerHTML = 'Total costs:<span class="total-costs">' + currency + amountCosts + '</span>';
activityField.append(totalCosts);


allCheckBoxes.forEach(checkBox => {
    let dayAndTime = checkBox.dataset.dayAndTime,
        cost = checkBox.dataset.cost;

    checkBox.addEventListener("change", event => {
        let pickedActivity = event.target,
            pickedDate = pickedActivity.dataset.dayAndTime,
            pickedCost = pickedActivity.dataset.cost;

        // Use picked date and compare to dataset from sibling checkboxes and disable if they are overlapping. 
        allCheckBoxes.forEach(checkBox => {
            if (pickedDate && checkBox.dataset.dayAndTime == pickedDate) {
                if (!checkBox.checked && pickedActivity.checked) {
                    checkBox.parentNode.style.color = 'rgba(0,0,0,0.35)';
                    checkBox.disabled = true;
                } else if (checkBox.disabled && !pickedActivity.checked) {
                    checkBox.parentNode.style.color = 'inherit';
                    checkBox.disabled = false;
                }
            }
        });

        // Decrease or increase costs based on selected activities.
        if (cost && pickedActivity.checked) {
            amountCosts += parseInt(pickedCost);
        } else if (cost && !pickedActivity.checked) {
            amountCosts -= parseInt(pickedCost);
        }

        // Update HTML with total costs.
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

// Disable the 1st option with instructions.
paymentMethodOption.disabled = true;

// Hide all panels other than credit-card.
paymentPaypal.style.display = 'none';
paymentBitcoin.style.display = 'none';

// Show and hide info panels / form based on payment select.
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

// Set default selection to credit-card.
selectPayment.selectedIndex = 1;

/*****************************************
Form validation
*****************************************/
const nameField = document.querySelector('input#name'),
    emailField = document.querySelector('input#mail'),
    submitButton = document.querySelector('button[type="submit"'),
    creditCardNumber = document.querySelector('input#cc-num'),
    zipCode = document.querySelector('input#zip'),
    cvv = document.querySelector('input#cvv');

// Speaks for itself.
function validateName() {
    const regex = /^\D+\s?\w*$/i;

    return regex.test(nameField.value);
}

function validateEmail() {
    const regex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/i;

    return regex.test(emailField.value);
}

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

// Add or remove error styling based on validation.
function toggleError(validation, element, message) {
    validation ? element.classList.remove('error') : element.classList.add('error');
    errorMessage(validation, element, message);
}

// Add or remove error message based on validation.
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

// Add validation to name field.
nameField.addEventListener('blur', () => {
    toggleError(validateName(), nameField);
});

// Add validation to email field.
emailField.addEventListener('input', () => {
    toggleError(validateEmail(), emailField, 'Please provide a valid email address.');
});
emailField.addEventListener('blur', () => {
    toggleError(validateEmail(), emailField, 'Please provide a valid email address.');
});
    
// Add validation to credit card number field.
creditCardNumber.addEventListener('blur', () => {
    toggleError(validateCreditCardName(), creditCardNumber, 'Please provide a number between 13 and 16 characters.');
});

// Add validation to zip code field.
zipCode.addEventListener('blur', () => {
    toggleError(validateZip(), zipCode, 'Please provide 5 numbers.');
});

// Add validation to zip code field.
cvv.addEventListener('blur', () => {
    toggleError(validateCvv(), cvv, 'Please provide 3 numbers.');
});

// Add validation to submission of form.
submitButton.addEventListener('click', event => {
    event.preventDefault();
    toggleError(validateName(), nameField);
    toggleError(validateEmail(), emailField);
    toggleError(validateActivities(), activityField, 'Select at least 1 activity.');
    toggleError(validateCreditCardName(), creditCardNumber);
    toggleError(validateZip(), zipCode);
    toggleError(validateCvv(), cvv);
});