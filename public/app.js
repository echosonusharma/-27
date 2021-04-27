//selectors
const input = document.getElementById("input");
const submit = document.getElementById("submit");
const res = document.getElementById("res");
const form = document.querySelector(".form")

//func
const getData = async (event) => {
    event.preventDefault();
    const x = await fetch('/url', {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify({
            url: `${input.value}`
        })
    });
    if (x.status === 429) {
        form.style.display = '';
        res.innerText = 'You are sending too many requests 😒. Try again in 30 seconds.';
    }
    const result = await x.json();
    if (result.url) {
        form.style.display = 'none';
        res.innerText = `https://x-27.herokuapp.com/${result.url}`
    }
    if (result.msg) {
        form.style.display = '';
        res.innerText = `${result.msg}`
    }
};



submit.addEventListener('click', getData);


