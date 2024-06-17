const sheetyApiUrl = 'https://api.sheety.co/6e986985092a741c5c6688f11fd22148/influencersScreening (responses)/formResponses1'; // Replace with your Sheety API URL

let selectedPackage = null;

function openUuidModal(packageType) {
    selectedPackage = packageType;
    document.getElementById('uuid-modal').style.display = 'block';
}

function closeUuidModal() {
    document.getElementById('uuid-modal').style.display = 'none';
    document.getElementById('uuid-input').value = '';
}

function submitUuid() {
    const uuid = document.getElementById('uuid-input').value;
    if (uuid) {
        selectPackage(uuid, selectedPackage);
        closeUuidModal();
    } else {
        alert("UUID is required to select a package.");
    }
}

function selectPackage(uuid, packageType) {
    const data = { uuid: uuid, package: packageType };

    fetch(sheetyApiUrl)
        .then(response => response.json())
        .then(data => {
            const user = data.formResponses1.find(user => user.uuid === uuid);
            if (user) {
                if (user.status === 'Accepted') {
                    updatePackage(user.id, packageType); // Use the ID from the retrieved data
                } else {
                    alert('Not allowed');
                }
            } else {
                alert('UUID not found');
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

function updatePackage(rowId, packageType) {
    const url = `${sheetyApiUrl}/${rowId}`;
    const body = {
        formResponses1: {
            package: packageType
        }
    };
    
    fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    })
    .then(response => response.json())
    .then(data => {
        showConfirmation(packageType);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

function showConfirmation(packageType) {
    const confirmationElement = document.getElementById('confirmation');
    const messageElement = document.getElementById('confirmation-message');

    messageElement.textContent = `You have selected the ${packageType.charAt(0).toUpperCase() + packageType.slice(1)} Package!`;
    confirmationElement.style.display = 'block';

    setTimeout(() => {
        confirmationElement.style.display = 'none';
    }, 3000);
}

function showInfo(packageType) {
    const infoModal = document.getElementById('info-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');

    if (packageType === 'gold') {
        modalTitle.textContent = 'Gold Package';
        modalDescription.innerHTML = 'The Gold Package offers exclusive benefits, premium support, and more!<br>Admin Fees 3% + Influencer Management Fee XX% + Arranger fee 1.4% p.m.';
    } else if (packageType === 'silver') {
        modalTitle.textContent = 'Silver Package';
        modalDescription.innerHTML = 'The Silver Package provides standard benefits and support at an affordable price.';
    }

    infoModal.style.display = 'block';
}

function closeInfo() {
    const infoModal = document.getElementById('info-modal');
    infoModal.style.display = 'none';
}

// Debugging: To test if the function is being called correctly
document.querySelectorAll('.info-button').forEach(button => {
    button.addEventListener('click', event => {
        const packageType = event.target.parentElement.id;
        showInfo(packageType);
    });
});