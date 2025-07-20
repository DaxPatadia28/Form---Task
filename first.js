document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('userForm');
    const numberInput = document.getElementById('number');
    const table = document.getElementById('detailsTable');
    const tbody = table.querySelector('tbody');
    const cityInput = document.getElementById('city');
    const cityCountTable = document.getElementById('cityCountTable');
    const cityCountTbody = cityCountTable.querySelector('tbody');


    function getUsersFromStorage() {
        const users = localStorage.getItem('users');
        return users ? JSON.parse(users) : [];
    }

    
    function saveUsersToStorage(users) {
        localStorage.setItem('users', JSON.stringify(users));
    }

    
    function addRowToTable(user, userIdx = null, usersArr = null) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.name}</td>
            <td>${user.number}</td>
            <td>${user.email}</td>
            <td>${user.dob}</td>
            <td>${user.age}</td>
            <td>${user.city}</td>
            <td><img src="${user.image || ''}" alt="User Image" style="width:50px;height:50px;object-fit:cover;" /></td>
            <td>
                <button class='edit-user-btn'>Edit</button>
                <button class='delete-user-btn'>Delete</button>
            </td>
        `;
        tbody.appendChild(row);
        
        row.querySelector('.delete-user-btn').addEventListener('click', function() {
            const allUsers = usersArr || getUsersFromStorage();
            let idx = userIdx;
            if (idx === null) {
                idx = allUsers.findIndex(u => u.number === user.number && u.email === user.email && u.dob === user.dob);
            }
            if (idx > -1) {
                allUsers.splice(idx, 1);
                saveUsersToStorage(allUsers);
                tbody.innerHTML = '';
                allUsers.forEach((u, i) => addRowToTable(u, i, allUsers));
                updateCityCountTable(allUsers);
                if (allUsers.length === 0) table.style.display = 'none';
            }
        });
        
        row.querySelector('.edit-user-btn').addEventListener('click', function() {

            row.innerHTML = `
                <td><input type='text' value='${user.name}' class='edit-name' /></td>
                <td><input type='text' value='${user.number}' class='edit-number' maxlength='10' /></td>
                <td><input type='email' value='${user.email}' class='edit-email' /></td>
                <td><input type='date' value='${user.dob}' class='edit-dob' /></td>
                <td>${user.age}</td>
                <td><input type='text' value='${user.city}' class='edit-city' /></td>
                <td><input type='file' class='edit-image' accept='image/*' /></td>
                <td>
                    <button class='save-user-btn'>Save</button>
                    <button class='cancel-user-btn'>Cancel</button>
                </td>
            `;
            
            row.querySelector('.cancel-user-btn').addEventListener('click', function() {
                row.innerHTML = '';
                addRowToTable(user, userIdx, usersArr);
            });
            
            row.querySelector('.save-user-btn').addEventListener('click', function() {
                const allUsers = usersArr || getUsersFromStorage();
                let idx = userIdx;
                if (idx === null) {
                    idx = allUsers.findIndex(u => u.number === user.number && u.email === user.email && u.dob === user.dob);
                }
                if (idx > -1) {
                    const name = row.querySelector('.edit-name').value.trim();
                    const number = row.querySelector('.edit-number').value.trim();
                    const email = row.querySelector('.edit-email').value.trim();
                    const dob = row.querySelector('.edit-dob').value;
                    const city = row.querySelector('.edit-city').value.trim();
                    let age = user.age;
                    if (dob) {
                        const today = new Date();
                        const birthDate = new Date(dob);
                        age = today.getFullYear() - birthDate.getFullYear();
                        const m = today.getMonth() - birthDate.getMonth();
                        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                            age--;
                        }
                    }
                    
                    if (!/^\d{10}$/.test(number)) {
                        alert('Invalid contact number! It must be 10 digits long.');
                        return;
                    }
                    if (age <= 18) {
                        alert('User must be older than 18 years.');
                        return;
                    }
                    
                    const imageInput = row.querySelector('.edit-image');
                    const imageFile = imageInput.files[0];
                    function finishUpdate(imageDataUrl) {
                        allUsers[idx] = { name, number, email, dob, age, city, image: imageDataUrl || user.image };
                        saveUsersToStorage(allUsers);
                        tbody.innerHTML = '';
                        allUsers.forEach((u, i) => addRowToTable(u, i, allUsers));
                        updateCityCountTable(allUsers);
                    }
                    if (imageFile) {
                        const reader = new FileReader();
                        reader.onload = function(e) {
                            finishUpdate(e.target.result);
                        };
                        reader.readAsDataURL(imageFile);
                    } else {
                        finishUpdate();
                    }
                }
            });
        });
    }

    function updateCityCountTable(users) {
        const cityCounts = {};
        const cityDisplayNames = {};
        users.forEach(user => {
            if (user.city) {
                const cityKey = user.city.trim().toLowerCase();
                cityCounts[cityKey] = (cityCounts[cityKey] || 0) + 1;
                if (!cityDisplayNames[cityKey]) {
                    cityDisplayNames[cityKey] = user.city.trim();
                }
            }
        });
        cityCountTbody.innerHTML = '';
        let srNo = 1;
        Object.entries(cityCounts).forEach(([cityKey, count]) => {
            const displayCity = cityDisplayNames[cityKey];
            const row = document.createElement('tr');
            row.innerHTML = `<td>${srNo++}</td><td>${displayCity}</td><td>${count}</td><td><button class=\"view-users-btn\" data-city=\"${cityKey}\">View Users</button></td>`;
            cityCountTbody.appendChild(row);
        });

        
        const viewButtons = cityCountTbody.querySelectorAll('.view-users-btn');
        viewButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const cityKey = this.getAttribute('data-city');
                const allUsers = getUsersFromStorage();
                const usersInCity = allUsers.filter(u => u.city && u.city.trim().toLowerCase() === cityKey);
               
                tbody.innerHTML = '';
                usersInCity.forEach(user => addRowToTable(user));
                table.style.display = usersInCity.length > 0 ? '' : 'none';
            });
        });
    }

    cityCountTbody.innerHTML = '';

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
        const city = document.getElementById('city').value;
        const imageInput = document.getElementById('image');
        const imageFile = imageInput.files[0];

        if (!/^[\d]{10}$/.test(number)) {
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

        if (!imageFile) {
            alert('Please upload an image.');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            const imageDataUrl = e.target.result;
            const user = { name, number, email, dob, age, city, image: imageDataUrl };
            const users = getUsersFromStorage();
            users.push(user);
            saveUsersToStorage(users);
            addRowToTable(user);
            form.reset();
            updateCityCountTable(users);
        };
        reader.readAsDataURL(imageFile);
    });


    const clearBtn = document.getElementById('clearUsersBtn');
    if (clearBtn) {
        clearBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to delete all user data?')) {
                localStorage.removeItem('users');
                tbody.innerHTML = '';
                updateCityCountTable([]);
                table.style.display = 'none';
            }
        });
    }


    const showAllBtn = document.getElementById('showAllUsersBtn');
    if (showAllBtn) {
        showAllBtn.addEventListener('click', function() {
            const allUsers = getUsersFromStorage();
            tbody.innerHTML = '';
            allUsers.forEach(user => addRowToTable(user));
            table.style.display = allUsers.length > 0 ? '' : 'none';
        });
    }


    updateCityCountTable(getUsersFromStorage());

    table.style.display = 'none';
});
