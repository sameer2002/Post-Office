const currentip = document.getElementById('curr-ip');
const fectdatabtn = document.getElementById('start-api');

async function getUserIP() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');   
        const data = await response.json();
        currentip.innerText = `Your Current IP Address is ${data.ip}`;
        return data.ip;
    } catch (error) {
        console.error('Error:', error);
        currentip.innerText = 'Error fetching IP address.';
    }
}

getUserIP();

fectdatabtn.addEventListener('click', async () => {
    const ip = await getUserIP();
    if (ip) {
        window.location.href = `listing.html?ip=${ip}`;
    }
});

