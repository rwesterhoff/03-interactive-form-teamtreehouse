/*****************************************
Set focus on the first text field
*****************************************/
const firstTextField = document.querySelector('form input');

firstTextField.focus();

/*****************************************
”Job Role” section
*****************************************/
const jobRoleSelect = document.querySelector('form select#title'),
    jobRoleTextField = document.querySelector('#other-field');

jobRoleTextField.style.display = "none";

// Show or hide job role field.
jobRoleSelect.addEventListener("change", event => {
    if (jobRoleSelect.value === "other") {
        jobRoleTextField.style.display = "block"
    } else {
        jobRoleTextField.style.display = "none";
    }
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
    let cost = checkBox.dataset.cost;

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
    paymentCredit = document.querySelector('#credit-card'),
    paymentPaypal = document.querySelector('#paypal'),
    paymentBitcoin = document.querySelector('#bitcoin');
let paymentSelected = null;

function resetPaymentPanels() {
    paymentSelected = selectPayment.value;

    paymentCredit.style.display = 'none';
    paymentPaypal.style.display = 'none';
    paymentBitcoin.style.display = 'none';

    if (paymentSelected == 'credit card') {
        paymentCredit.style.display = 'inherit';
    } else if (paymentSelected == 'paypal') {
        paymentPaypal.style.display = 'inherit';
    } else if (paymentSelected == 'bitcoin') {
        paymentBitcoin.style.display = 'inherit';
    }
}

// Disable the 1st option with instructions.
selectPayment[0].disabled = true;

// Set default selection to credit-card.
selectPayment.selectedIndex = 1;

// Hide all panels other than selected.
resetPaymentPanels();

// Show and hide info panels / form based on payment select.
selectPayment.addEventListener('change', resetPaymentPanels);

/*****************************************
Form validation
*****************************************/
const nameField = document.querySelector('input#name'),
    emailField = document.querySelector('input#mail'),
    creditCardNumber = document.querySelector('input#cc-num'),
    zipCode = document.querySelector('input#zip'),
    cvv = document.querySelector('input#cvv'),
    submitButton = document.querySelector('button[type="submit"');
let errorMessage = null;

// Speaks for itself.
function validateRegEx(regex, element) {
    return regex.test(element.value);
}

// Add or remove error based on validation.
function toggleError(validation, element, message) {
    const errorClass = 'error',
        p = document.createElement('p'),
        sibling = element.nextElementSibling,
        errorMessageClass = 'error-message',
        controlErrorStyling = () => {
            if (validation) {
                element.classList.remove(errorClass);
            } else {
                element.classList.add(errorClass);
            }
        },
        createMessage = (targetElement) => {
            if (element.value === '') {
                targetElement.innerText = 'This field cannot be empty.';
            } else {
                targetElement.innerText = message;
            }
        },
        removeMessage = () => {
            if (sibling) element.parentNode.removeChild(sibling);
        },
        controlErrorMessage = () => {
            p.classList.add(errorMessageClass);
            if (sibling) {
                if (!validation && !sibling.classList.contains(errorMessageClass)) {
                    element.parentNode.insertBefore(p, sibling);
                    createMessage(p);
                } else if (!validation && sibling.classList.contains(errorMessageClass)) {
                    createMessage(sibling);
                } else if (validation && sibling.classList.contains(errorMessageClass)) {
                    removeMessage();
                }
            } else {
                if (!validation) {
                    element.parentNode.appendChild(p);
                    createMessage(p);
                } else if (validation) {
                    removeMessage();
                }
            }
        };

    controlErrorStyling();
    controlErrorMessage();
}

function validateName() {
    errorMessage = 'Please provide a valid name.';
    toggleError(validateRegEx(/^\D+\s?\w*$/i, nameField), nameField, errorMessage);
}

function validateEmail() {
    errorMessage = 'Please provide a valid email address.';
    toggleError(validateRegEx(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/i, emailField), emailField, errorMessage);
}

function validateActivities() {
    errorMessage = 'Select at least 1 activity.';
    let checked = null;

    for (let i = 0; i < allCheckBoxes.length; i++) {
        if (allCheckBoxes[i].checked) {
            checked = true;
        }
    }

    toggleError(checked, activityField, errorMessage);
}

function validateCreditCardName() {
    errorMessage = 'Please provide range of numbers between 13 and 16 characters.';
    toggleError(validateRegEx(/^\d{13,16}$/i, creditCardNumber), creditCardNumber, errorMessage);
}

function validateZip() {
    errorMessage = 'Please provide 5 numbers.';
    toggleError(validateRegEx(/^\d{5}$/i, zipCode), zipCode, errorMessage);
}

function validateCvv() {
    errorMessage = 'Please provide 3 numbers.';
    toggleError(validateRegEx(/^\d{3}$/i, cvv), cvv, errorMessage);
}

// Add validation to name field.
nameField.addEventListener('input', validateName);
nameField.addEventListener('blur', validateName);

// Add validation to email field.
emailField.addEventListener('input', validateEmail);
emailField.addEventListener('blur', validateEmail);

// Add validation to credit card number field.
creditCardNumber.addEventListener('input', validateCreditCardName);
creditCardNumber.addEventListener('blur', validateCreditCardName);

// Add validation to zip code field.
zipCode.addEventListener('input', validateZip);
zipCode.addEventListener('blur', validateZip);

// Add validation to zip code field.
cvv.addEventListener('input', validateCvv);
cvv.addEventListener('blur', validateCvv);

// Add validation to submission of form.
submitButton.addEventListener('click', event => {
    event.preventDefault();
    validateName();
    validateEmail();
    validateActivities(); // Add credit-card validation only when correct payment method is selected.
    if (paymentSelected == 'credit card') {
        validateCreditCardName();
        validateZip();
        validateCvv();
    }
});