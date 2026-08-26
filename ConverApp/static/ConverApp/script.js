/*
* Variables declaration*/
const firstInput = document.querySelector('#first-input')
const secondInput = document.querySelector('#second-input')
const switchBtn = document.querySelector('#switchBtn')
const baseMeta = document.querySelector('#base-meta')
const targetMeta = document.querySelector('#target-meta')
const exchangeRate = document.querySelector('#exchange-rate')
const updateAt = document.querySelector('#update-at')
const today = new Date();
const alertBtn = document.querySelector('#alert-btn')
const alertDiv = document.querySelector('#alert-div')

let alertTimeout
alertDiv.hidden = true

// Initialize Tom Select
const firstSelect = new TomSelect('#currency-first', {
    create: false, // disable user typing creation for this example
    closeAfterSelect: true,
    onChange: function (value) {
        convert(firstSelect.getValue(), secondSelect.getValue(), firstInput.value)
    }
});
const secondSelect = new TomSelect('#currency-second', {
    create: false, // disable user typing creation for this example
    closeAfterSelect: true,
    onChange: function (value) {
        convert(firstSelect.getValue(), secondSelect.getValue(), firstInput.value)
    }
});


/*
* Attempt to load all the DOM content*/
document.addEventListener('DOMContentLoaded', () => {
    // Get all currencies code and symboles
    getCurrencySelects()

    // Close the alert PopUp when the user click on the button
    alertBtn.addEventListener('click', hideAlert)

    //     Manage the main container animation state
    const container = document.querySelector('#container')
    container.addEventListener('mouseenter', () => {
        container.style.animationPlayState = 'paused'
        container.style.boxShadow = 'none'
    })
    container.addEventListener('mouseleave', () => {
        container.style.animationPlayState = 'running'
        container.style.boxShadow = ''
    })

})

function showAlert(message) {
    document.querySelector('#alert-message').textContent = message
    clearTimeout(alertTimeout)
    alertDiv.hidden = false
    alertTimeout = setTimeout(hideAlert, 3000)
}

function hideAlert() {
    alertDiv.hidden = true
    clearTimeout(alertTimeout)
}

/*
* Attempt for an Event listener when user select an
* currency option or if amount input is change.
* Call the convert function*/
firstInput.addEventListener('input', () => {
    convert(firstSelect.getValue(), secondSelect.getValue(), firstInput.value)
})

/*
* Attempt to an EventListener when user click on the
switchBtn and call switchCode function*/
switchBtn.addEventListener('click', () => {
    switchCode(firstSelect.getValue(), secondSelect.getValue(), firstInput.value)
    convert(firstSelect.getValue(), secondSelect.getValue(), firstInput.value)
    console.log('Switch')
})

/*
* This function switch between BASE_CODE and TARGET_CODE
* Then call convert() function to update data */
function switchCode() {
    const bCode = firstSelect.getValue()
    const tCode = secondSelect.getValue()

    firstSelect.setValue(tCode, true)
    secondSelect.setValue(bCode, true)

    convert(firstSelect.getValue(), secondSelect.getValue(), firstInput.value)
}

/*
* This function call the 'AlratesToDay symbole service' and get
* all symboles and code of currencies.
* Then it create the option of select input using data that she
* get since API.*/
async function getCurrencySelects() {


    try {
        const response = await fetch('/api/symbols/')

        if (!response.ok) {
            throw new Error(response.status)
        }
        const data = await response.json()

        data.currencies.forEach(currency => {

            // Create first select options
            firstSelect.addOption(
                {value: `${currency.code}`, text: `${currency.code} - ${currency.name}`}
            )

            secondSelect.addOption(
                {value: `${currency.code}`, text: `${currency.code} - ${currency.name}`}
            )
        })
    } catch (error) {
        console.error(error)
        showAlert('Erreur : impossible de convertir. Réessaie plus tard.')

    }
}

/*
* THIS FUNCTION TAKE THREE PARAMETERS (BASE_CODE, TARGET_CODE AND AMOUNT)
* The function fetch the API url, and get the data from Django server.
* Then it update the interface without refresh or reload the page.*/
async function convert(BASE_CODE, TARGET_CODE, AMOUNT) {

    const source = BASE_CODE
    const target = TARGET_CODE
    const amount = AMOUNT

    if (amount <= 0) {
        showAlert('Veuillez entrez un montant valide')
    } else if (!source || !target) {
        showAlert('Veuillez choisir une devise source et une devise cible')
    } else {
        const params = new URLSearchParams(
            {source, target, amount})

        try {
            const response = await fetch(`/api/convert/?${params}`)

            if (!response.ok) {
                throw new Error(response.status)
            }
            const data = await response.json()
            secondInput.value = data.to.amount
            baseMeta.innerHTML = `${data.from.amount} ${data.from.currency} = `
            targetMeta.innerHTML = `${data.to.amount} ${data.to.currency}`
            exchangeRate.innerHTML = `Taux de change : 1 ${data.from.currency} = ${data.rate} ${data.to.currency}`
            updateAt.innerHTML = `Dernier mise a jour : ${today.toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })}`

            console.log(data)
        } catch (error) {
            showAlert('Erreur : impossible de convertir. Réessaie plus tard.')
            console.error(`Erreur : ${error}`)
        }
    }
}