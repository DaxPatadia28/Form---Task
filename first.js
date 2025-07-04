document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('userForm');
    const numberInput = document.getElementById('number');
    const table = document.getElementById('detailsTable');
    const tbody = table.querySelector('tbody');


    function getUsersFromStorage() {
        const users = localStorage.getItem('users');
        return users ? JSON.parse(users) : [];
    }

    
    function saveUsersToStorage(users) {
        localStorage.setItem('users', JSON.stringify(users));
    }

    
    function addRowToTable(user) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.name}</td>
            <td>${user.number}</td>
            <td>${user.email}</td>
            <td>${user.dob}</td>
            <td>${user.age}</td>
        `;
        tbody.appendChild(row);
    }

    
   
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

        
        const user = { name, number, email, dob, age };

        
        const users = getUsersFromStorage();
        users.push(user);
        saveUsersToStorage(users);

        
        addRowToTable(user);
        form.reset();
    });
});
