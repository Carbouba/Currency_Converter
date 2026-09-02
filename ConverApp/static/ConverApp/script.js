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

//////////////////////////////// OLD VERSION TO LIMITE API USAGE ////////////////////////////////////////////////////////////
// const DAILY_LIMIT = 5
// const USAGE_KEY = 'conversion-usage'
//
// function getUsage() {
//     const stored = JSON.parse(localStorage.getItem(USAGE_KEY) || 'null')
//     const today = new Date().toDateString()
//
//     // Nouveau jour (ou première visite) → on repart de zéro
//     if (!stored || stored.date !== today) {
//         return {date: today, count: 0}
//     }
//     return stored
// }
//
// function incrementUsage() {
//     const usage = getUsage()
//     usage.count += 1
//     localStorage.setItem(USAGE_KEY, JSON.stringify(usage))
//     return usage.count
// }
//
// function isLimitReached() {
//     return getUsage().count >= DAILY_LIMIT
// }
//
// function lockInterface() {
//     firstInput.disabled = true
//     secondInput.disabled = true
//     switchBtn.disabled = true
//     firstSelect.disable()   // API Tom Select
//     secondSelect.disable()  // API Tom Select
// }
//
// function showLimitAlert() {
//     // document.querySelector('#alert-message').textContent = `Limite quotidienne atteinte (${DAILY_LIMIT} conversions). Réessaie demain.`
//     document.querySelector('#alert-message').innerHTML = `Erreur server interne. Impossible de convertir.<br> Réessaie demain.<br>`
//     clearTimeout(alertTimeout)
//     alertDiv.hidden = false
// }
//////////////////////////////// OLD VERSION TO LIMITE API USAGE ////////////////////////////////////////////////////////////

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
            if (response.ok) {
                const data = await response.json()
                console.log(data.conversion.toFixed(2))
                secondInput.value = `${data.conversion.toFixed(2)}`
                baseMeta.innerHTML = `${data.amount} ${data.source} = `
                targetMeta.innerHTML = `${data.conversion.toFixed(2)} ${data.target}`
                exchangeRate.innerHTML = `Taux de change : 1 ${data.source} = ${data.rate} ${data.target}`
                updateAt.innerHTML = `Dernier mise a jour le : ${data.date}`
                // updateAt.innerHTML = `Dernier mise a jour le : ${today.toLocaleDateString('fr-FR', {
                //     day: '2-digit',
                //     month: 'long',
                //     year: 'numeric',
                //     hour: '2-digit',
                //     minute: '2-digit'
                // })}`

                console.log(data)
            }

        } catch (error) {
            showAlert('Erreur : impossible de convertir. Réessaie plus tard.')
            console.error(`Erreur : ${error}`)
        }
    }
}