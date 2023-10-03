//const token=`cdbbf224ad1ee7`
window.onload = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const ip = urlParams.get('ip');

    document.getElementById('ip-add').innerHTML = `IP Address : <span>${ip}</span>`;

    try {
        const response = await fetch(`https://ipapi.co/${ip}/json/`);
        const data = await response.json();
        console.log(data)
        getdataonui(data);
    } catch (error) {
        console.error('Error:', error);
        alert('Error fetching IP information: ' + error.message);
    }
   
};
const info=document.querySelector('.info');
function getdataonui(data){
    const lat = data.latitude;
    const long = data.longitude;
    const hostname = data?.hostname || "N/A";
    info.innerHTML=`
    <div class="info-div">
    <p>Lat: <span>${lat}</span></p>
    <p>Long: <span>${long}</span></p>
    </div>
          <div class="info-div">
            <p>City: <span>${data.city}</span></p>
            <p>Region: <span>${data.region}</span></p>
        </div>
        <div class="info-div">
            <p>Organisation: <span>${data.org}</span></p>
            <p>Hostname: <span>${hostname}</span></p>
        </div> `;
        const mapIframe = document.getElementById('location-map');
        mapIframe.src = `https://maps.google.com/maps?q=${lat},${long}&z=15&output=embed`;

        document.getElementById('time-zone').innerText = data.timezone;
        const currentDateTime = new Date().toLocaleString("en-US", { timeZone: data.timezone });
        document.getElementById('date-time').innerText = currentDateTime;
    
        document.getElementById('pincode').innerText = data.postal;
        if(data.postal) {
            document.getElementById('message').innerText = "1";
            getPostOffices(data.postal);
        } else {
            document.getElementById('message').innerText = "0";
        }
    
}
async function getPostOffices(pincode) {
    const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
    const data = await response.json();
    
    if (data[0].Status === 'Success') {
        const postOffices = data[0].PostOffice;
        console.log(postOffices)
        displayPostOffices(postOffices);
       filterPostOffices(postOffices);
    } else {
        alert('No post offices found for this pincode.');
    }
}
function displayPostOffices(postOffices) {
    const container = document.querySelector('.listing-container');
    container.innerHTML = ""; // clear existing entries

    postOffices.forEach(office => {
        const card = document.createElement('div');
        card.className='card';
        card.innerHTML=`
                    <p> ${office.Name}</p>
                    <p>${office.BranchType}</p>
                    <p> ${office.DeliveryStatus}</p>
                    <p>${office.District}</p>
                    <p> ${office.Division}</p>
        `;
        container.appendChild(card);
    });
}
function filterPostOffices(postOffices) {
    const searchInput = document.getElementById('post-office-search');
    
    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase();
        const filtered = postOffices.filter(office => office.Name.toLowerCase().includes(query) || office.BranchType.toLowerCase().includes(query));
        displayPostOffices(filtered);
    });
}