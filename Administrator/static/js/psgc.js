const API_KEY = "1c82088bdd363775751dfe7419cb45e5d36299cd289c5b490e8f0ffdf5455960";
const GLOBAL_URL = "https://api.countrystatecity.in/v1";
const apiBase = "https://psgc.gitlab.io/api";

const headers = new Headers();
headers.append("X-CSCAPI-KEY", API_KEY);

// --- 1. HOME ADDRESS LOGIC (PSGC ONLY) ---

async function loadHomeRegions() {
    const res = await fetch(`${apiBase}/regions/`);
    const data = await res.json();
    const regionSelect = document.getElementById('region');
    data.sort((a, b) => a.name.localeCompare(b.name)).forEach(r => {
        regionSelect.add(new Option(r.name, r.code));
    });
}

async function loadHomeData(endpoint, targetId, placeholder) {
    const target = document.getElementById(targetId);
    target.innerHTML = `<option value="">Loading...</option>`;
    target.disabled = true;

    try {
        const res = await fetch(`${apiBase}/${endpoint}`);
        const data = await res.json();
        data.sort((a, b) => a.name.localeCompare(b.name));
        
        target.innerHTML = `<option value="" selected disabled>Choose ${placeholder}...</option>`;
        data.forEach(item => target.add(new Option(item.name, item.code)));
        target.disabled = false;
    } catch (e) { target.innerHTML = `<option>Error</option>`; }
}

// Home Event Listeners
document.getElementById('region').onchange = (e) => {
    resetHome(['province', 'municipality', 'barangay']);
    if (e.target.value) loadHomeData(`regions/${e.target.value}/provinces/`, 'province', 'Province');
    updateHiddenFields('home');
};

document.getElementById('province').onchange = (e) => {
    resetHome(['municipality', 'barangay']);
    if (e.target.value) loadHomeData(`provinces/${e.target.value}/cities-municipalities/`, 'municipality', 'Municipality');
    updateHiddenFields('home');
};

document.getElementById('municipality').onchange = (e) => {
    resetHome(['barangay']);
    if (e.target.value) loadHomeData(`cities-municipalities/${e.target.value}/barangays/`, 'barangay', 'Barangay');
    updateHiddenFields('home');
};

document.getElementById('barangay').onchange = () => updateHiddenFields('home');

function resetHome(ids) {
    ids.forEach(id => {
        const el = document.getElementById(id);
        el.innerHTML = `<option value="" selected disabled>Choose...</option>`;
        el.disabled = true;
    });
}

// --- 2. BIRTHPLACE LOGIC (GLOBAL + PSGC BRIDGE) ---

async function loadBirthCountries() {
    const res = await fetch(`${GLOBAL_URL}/countries`, { headers });
    const data = await res.json();
    const bCountry = document.getElementById('birth_country');
    data.forEach(c => bCountry.add(new Option(c.name, c.iso2)));
}

document.getElementById('birth_country').onchange = async (e) => {
    const ccode = e.target.value;
    const bState = document.getElementById('birth_state');
    const bProvCont = document.getElementById('birth_province_container');
    const bBrgyCont = document.getElementById('birth_brgy_container');
    
    // Reset following fields
    resetBirth(['birth_state', 'birth_province', 'birth_city', 'birth_barangay']);
    
    bState.innerHTML = '<option>Loading...</option>';

    if (ccode === 'PH') {
        // Use PH API for Regions
        bProvCont.style.display = 'block';
        bBrgyCont.style.display = 'block';
        const res = await fetch(`${apiBase}/regions/`);
        const data = await res.json();
        bState.innerHTML = '<option value="" selected disabled>Select Region</option>';
        data.sort((a, b) => a.name.localeCompare(b.name)).forEach(r => bState.add(new Option(r.name, r.code)));
    } else {
        // Use Global API for States
        bProvCont.style.display = 'none';
        bBrgyCont.style.display = 'none';
        const res = await fetch(`${GLOBAL_URL}/countries/${ccode}/states`, { headers });
        const data = await res.json();
        bState.innerHTML = '<option value="" selected disabled>Select State</option>';
        data.forEach(s => bState.add(new Option(s.name, s.iso2)));
    }
    bState.disabled = false;
    updateHiddenFields('birth');
};

document.getElementById('birth_state').onchange = async (e) => {
    const ccode = document.getElementById('birth_country').value;
    const bProv = document.getElementById('birth_province');
    const bCity = document.getElementById('birth_city');
    
    resetBirth(['birth_province', 'birth_city', 'birth_barangay']);

    if (ccode === 'PH') {
        // Load PH Provinces
        bProv.innerHTML = '<option>Loading...</option>';
        const res = await fetch(`${apiBase}/regions/${e.target.value}/provinces/`);
        const data = await res.json();
        bProv.innerHTML = '<option value="" selected disabled>Select Province</option>';
        data.sort((a, b) => a.name.localeCompare(b.name)).forEach(p => bProv.add(new Option(p.name, p.code)));
        bProv.disabled = false;
    } else {
        // Load Global Cities
        bCity.innerHTML = '<option>Loading...</option>';
        const res = await fetch(`${GLOBAL_URL}/countries/${ccode}/states/${e.target.value}/cities`, { headers });
        const data = await res.json();
        bCity.innerHTML = '<option value="" selected disabled>Select City</option>';
        data.forEach(c => bCity.add(new Option(c.name, c.name)));
        bCity.disabled = false;
    }
    updateHiddenFields('birth');
};

document.getElementById('birth_state').onchange = async (e) => {
    const ccode = document.getElementById('birth_country').value;
    const bProv = document.getElementById('birth_province');
    const bCity = document.getElementById('birth_city');
    
    resetBirth(['birth_province', 'birth_city', 'birth_barangay']);

    if (ccode === 'PH') {
        // Load PH Provinces
        bProv.innerHTML = '<option>Loading...</option>';
        const res = await fetch(`${apiBase}/regions/${e.target.value}/provinces/`);
        const data = await res.json();
        bProv.innerHTML = '<option value="" selected disabled>Select Province</option>';
        data.sort((a, b) => a.name.localeCompare(b.name)).forEach(p => bProv.add(new Option(p.name, p.code)));
        bProv.disabled = false;
    } else {
        // Load Global Cities
        bCity.innerHTML = '<option>Loading...</option>';
        const res = await fetch(`${GLOBAL_URL}/countries/${ccode}/states/${e.target.value}/cities`, { headers });
        const data = await res.json();
        bCity.innerHTML = '<option value="" selected disabled>Select City</option>';
        data.forEach(c => bCity.add(new Option(c.name, c.name)));
        bCity.disabled = false;
    }
    updateHiddenFields('birth');
};

document.getElementById('birth_province').onchange = async (e) => {
    const bCity = document.getElementById('birth_city');
    resetBirth(['birth_city', 'birth_barangay']);
    
    bCity.innerHTML = '<option>Loading...</option>';
    const res = await fetch(`${apiBase}/provinces/${e.target.value}/cities-municipalities/`);
    const data = await res.json();
    bCity.innerHTML = '<option value="" selected disabled>Select City</option>';
    data.sort((a, b) => a.name.localeCompare(b.name)).forEach(c => bCity.add(new Option(c.name, c.code)));
    bCity.disabled = false;
    updateHiddenFields('birth');
};

document.getElementById('birth_city').onchange = async (e) => {
    const ccode = document.getElementById('birth_country').value;
    updateHiddenFields('birth');
    
    if (ccode !== 'PH') return;

    const bBrgy = document.getElementById('birth_barangay');
    resetBirth(['birth_barangay']);
    
    bBrgy.innerHTML = '<option>Loading...</option>';
    const res = await fetch(`${apiBase}/cities-municipalities/${e.target.value}/barangays/`);
    const data = await res.json();
    bBrgy.innerHTML = '<option value="" selected disabled>Select Barangay</option>';
    data.sort((a, b) => a.name.localeCompare(b.name)).forEach(b => bBrgy.add(new Option(b.name, b.code)));
    bBrgy.disabled = false;
};

document.getElementById('birth_barangay').onchange = () => updateHiddenFields('birth');

function resetBirth(ids) {
    ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.innerHTML = `<option value="" selected disabled>Choose...</option>`;
            el.disabled = true;
        }
    });
}

// --- 3. THE PYTHON CONNECTOR ---

function updateHiddenFields(type) {
    const fields = type === 'home' 
        ? ['region', 'province', 'municipality', 'barangay'] 
        : ['country', 'state', 'province', 'city', 'barangay'];

    fields.forEach(f => {
        const sourceId = type === 'birth' ? `birth_${f}` : f;
        const targetId = type === 'birth' ? `hidden_birth_${f}` : `hidden_${f}`;
        const source = document.getElementById(sourceId);
        const target = document.getElementById(targetId);
        
        if (source && target) {
            const text = source.options[source.selectedIndex]?.text || "";
            // Don't save "Choose..." or "Loading..." as the value
            target.value = (source.value && !text.includes("Choose") && !text.includes("Select") && !text.includes("Loading")) ? text : "";
        }
    });
}

// Initialize Both
loadHomeRegions();
loadBirthCountries();