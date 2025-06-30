document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('userForm');
    const numberInput = document.getElementById('number');
    const table = document.getElementById('detailsTable');
    const tbody = table.querySelector('tbody');

    numberInput.addEventListener('input', function() {
        let numericValue = numberInput.value.replace(/[^0-9]/g, '');

        if (numericValue.length > 10) {
            numericValue = numericValue.slice(0, 10);
        }

        numberInput.value = numericValue;
    });

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const name = document.getElementById('name').value;
        const number = document.getElementById('number').value;
        const email = document.getElementById('email').value;
        const dob = document.getElementById('dob').value;

        if (!/^\d{10}$/.test(number)) {
            alert('Invalid contact number! It must be 10 digits long.');
            return;
        }

        const today = new Date();
        const birthDate = new Date(dob);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        if (age <= 18) {
            alert('User must be older than 18 years.');
            return;
        }

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${name}</td>
            <td>${number}</td>
            <td>${email}</td>
            <td>${dob}</td>
            <td>${age}</td>
        `;
        tbody.appendChild(row);
        form.reset();
    });
});
