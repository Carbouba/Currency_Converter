
document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#btn').addEventListener('click',  () => {
        convert()
    })
})

async function convert(){

    const source = 'USD'
        const target=  'XOF'
        const amount =  1

    const params = new URLSearchParams(
        {source, target, amount})

    const response = await fetch(`/api/convert/?${params}`)

    if (!response.ok){
        throw new Error(response.status)
    }
    const data = await response.json()
    document.querySelector('#result').textContent = `${data.from.currency} - ${data.to.currency}`
    console.log(data)
}