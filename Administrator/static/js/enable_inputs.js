function enableInputs() {
    const inputs = document.querySelectorAll('#editModal input, #editModal select');
    inputs.forEach(input => {
        input.disabled = false;
    });
    document.getElementById('editBtn').classList.add('d-none');
    document.getElementById('saveBtn').classList.remove('d-none');     
}