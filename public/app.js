//selectors
const input = document.getElementById("input");
const submit = document.getElementById("submit");
const res = document.getElementById("res");

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
        res.innerText = 'You are sending too many requests 😒. Try again in 30 seconds.';
    }
    const result = await x.json();
    if (result.url) {
        res.innerText = `http://localhost:8000/${result.url}`
    }
    if (result.msg) {
        res.innerText = `${result.msg}`
    }
};



submit.addEventListener('click', getData);


