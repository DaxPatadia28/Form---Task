document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('userForm');
    const table = document.getElementById('detailsTable');
    const tbody = table.querySelector('tbody');

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const name = document.getElementById('name').value;
        const number = document.getElementById('number').value;
        const email = document.getElementById('email').value;
        const dob = document.getElementById('dob').value;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${name}</td>
            <td>${number}</td>
            <td>${email}</td>
            <td>${dob}</td>
        `;
        tbody.appendChild(row);
        form.reset();
    });
});
