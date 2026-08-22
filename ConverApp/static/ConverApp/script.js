/*
* Variables declaration*/
const firstSelect = document.querySelector('#currency-first')
const firstInput = document.querySelector('#first-input')
const secondSelect = document.querySelector('#currency-second')
const secondInput = document.querySelector('#second-input')
const switchBtn = document.querySelector('#switchBtn')
const baseMeta = document.querySelector('#base-meta')
const targetMeta = document.querySelector('#target-meta')
const exchangeRate = document.querySelector('#exchange-rate')
const updateAt = document.querySelector('#update-at')

/*
* Attempt to load all the DOM content*/
document.addEventListener('DOMContentLoaded', () => {
    // Get all currencies code and symboles
    getCurrencySelects()

    /*
* Attempt for an Event listener when user select an
* currency option or if amount input is change.
* Call the convert function*/
    firstSelect.addEventListener('change', () => {
        convert(firstSelect.value, secondSelect.value, firstInput.value)
    })
    firstInput.addEventListener('input', () => {
        convert(firstSelect.value, secondSelect.value, firstInput.value)
    })
    secondSelect.addEventListener('change', () => {
        convert(firstSelect.value, secondSelect.value, firstInput.value)
    })

    /*
    * Attempt to an EventListener when user click on the
    switchBtn and call switchCode function*/
    switchBtn.addEventListener('click', () => {
        switchCode(firstSelect.value, secondSelect.value, firstInput.value)
        convert(firstSelect.value, secondSelect.value, firstInput.value)
        console.log('Switch')
    })
})

/*
* This function switch between BASE_CODE and TARGET_CODE
* Then call convert() function to update data */
function switchCode(bCode, tCode, bAmount) {
    firstSelect.value = tCode
    secondSelect.value = bCode

    console.log(firstSelect.value, secondSelect.value)
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
            const optionSource = document.createElement('option')
            optionSource.value = currency.code
            optionSource.textContent = `${currency.code} - ${currency.name}`
            if (currency.code === 'USD'){
                optionSource.selected = 'USD'
            }
            firstSelect.appendChild(optionSource)

            // Create second select options
            const optionTarget = document.createElement('option')
            optionTarget.value = currency.code
            optionTarget.textContent = `${currency.code} - ${currency.name}`
             if (currency.code === 'XOF'){
                optionSource.selected = 'XOF'
            }
            secondSelect.appendChild(optionTarget)
        })
    } catch (error) {
        exchangeRate.innerHTML = `Erreur : impossible de convertir. Réessaie plus tard.`
        console.error(error)

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

    if (!amount) {
        alert('Amount require')
    } else if (!source || !target) {
        alert('source et target requis')
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

            console.log(data)
        } catch (error) {
            exchangeRate.innerHTML = `Erreur : impossible de convertir. Réessaie plus tard.`
            console.error(error)
        }
    }
}