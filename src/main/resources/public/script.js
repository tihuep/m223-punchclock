const URL = 'http://localhost:8081';
let entries = [];

const dateAndTimeToDate = (dateString, timeString) => {
    return new Date(`${dateString}T${timeString}`).toISOString();
};

const createEntry = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const entry = {};
    entry['checkIn'] = dateAndTimeToDate(formData.get('checkInDate'), formData.get('checkInTime'));
    entry['checkOut'] = dateAndTimeToDate(formData.get('checkOutDate'), formData.get('checkOutTime'));

    if (entry.checkIn <= entry.checkOut){
        fetch(`${URL}/entries`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(entry)
        }).then((result) => {
            result.json().then((entry) => {
                entries.push(entry);
                renderEntries();
            });
        });
    }
};

const indexEntries = () => {
    fetch(`${URL}/entries`, {
        method: 'GET'
    }).then((result) => {
        result.json().then((result) => {
            entries = result;
            renderEntries();
        });
    });
    renderEntries();
};

const createCell = (text) => {
    const cell = document.createElement('td');
    cell.innerText = text;
    return cell;
};
/*
const createCellEditable = (text, type) => {
    const cell = document.createElement('td');
    const input = document.createElement('input');
    input.value = text;
    //input.type = type;
    cell.appendChild(input);
    return cell;
}
*/
const createDeleteButton = (id) => {
    const button = document.createElement('button');
    button.innerText = "Löschen";
    button.onclick = function (){
        var entry;
        entries.forEach(function(item){
            if (item.id === id){
                entry = item;
            }
        });
        if (entry !== undefined){
            fetch(`${URL}/entries/` + entry.id, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((result) => {
                indexEntries();
            });
        }
    };
    return button;
}
/*
const createEditButton = (id) => {
    const button = document.createElement('button');
    button.innerText = "Bearbeiten";
    button.onclick = function () {

    };
    return button;
}*/

const renderEntries = () => {
    const display = document.querySelector('#entryDisplay');
    display.innerHTML = '';
    entries.forEach((entry) => {
        const row = document.createElement('tr');
        row.appendChild(createCell(entry.id));
        row.appendChild(createCell(new Date(entry.checkIn).toLocaleString()));
        row.appendChild(createCell(new Date(entry.checkOut).toLocaleString()));
        row.appendChild(createDeleteButton(entry.id));
        //row.appendChild(createEditButton(entry.id));
        display.appendChild(row);
    });
};

document.addEventListener('DOMContentLoaded', function(){
    const createEntryForm = document.querySelector('#createEntryForm');
    createEntryForm.addEventListener('submit', createEntry);
    indexEntries();
});