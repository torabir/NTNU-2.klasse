function petterSmart() {
    let header = document.createElement("h1");
    let output = document.createElement("p");

    header.innerText = "Petter Smarts syke oppfinnelser!";
    output.innerText = "Petter Smart har mange fantastiske oppfinnelser. Her ser du 4 av dem.";
    header.id = "hjem";  // Setter ID for link til menyen
    document.body.append(header, output);
}

function addInventions() {
    let oppfinnelser = document.createElement("ol");

    let inventions = [
        {
            title: "Psycho-tractinator",
            image: "images/1.webp", 
            description: "Science notes: Dette er Psycho-Tractinator. Hvis du trenger en sinnsykt rask kaffetrakter / trakt med vakumsuger i bunn, skaffer du en psychotractinator"
        },
        {
            title: "Wasp-eradicatorama 3000",
            image: "images/2.webp", 
            description: "Science notes: Wasp-eradicatorama 3000 utsletter alle veps i en mils omkrets. For deg som hater veps!"
        },
        {
            title: "Latex-generator 50K PLUS",
            image: "images/3.webp", 
            description: "Science notes: Latex-generator 50K PLUS er oppgraderingen fra Latex-generator 50K og forgjengeren Latex-generator 49999"
        },
        {
            title: "The Whole-oh-Egg",
            image: "images/4.webp", 
            description: "Science notes: The Whole-oh-Egg hjelper deg å sette sammen egg du helst ikke skulle ha knust. Til feks anoreksikere og andre i kaloriunderskudd."
        }
    ];

    inventions.forEach(function(invention) {
        let listItem = document.createElement("li");

        let header = document.createElement("h2");
        header.innerText = invention.title;

        let img = document.createElement("img");
        img.src = invention.image;
        img.alt = invention.title;

        let description = document.createElement("p");
        description.innerText = invention.description;

        listItem.append(header, img, description);
        oppfinnelser.appendChild(listItem);
    });

    document.body.appendChild(oppfinnelser);
}

function addContactInfoAndHours() {
    let contactHeader = document.createElement("h2");
    contactHeader.id = "kontaktinfo";  
    contactHeader.innerText = "Kontaktinformasjon";
    document.body.appendChild(contactHeader);

    let contactInfo = document.createElement("p");
    contactInfo.innerHTML = "Petter Smart Verksted<br>Email: pettersmart@oppfinnelser.no<br>Tlf: 12345678";
    document.body.appendChild(contactInfo);

    let tableHeader = document.createElement("h2");
    tableHeader.innerText = "Verkstedets åpningstider";
    document.body.appendChild(tableHeader);

    let table = document.createElement("table");
    table.innerHTML = `
        <tr>
            <th>Dag</th>
            <th>Åpningstid</th>
        </tr>
        <tr>
            <td>Mandag - Fredag</td>
            <td>08:00 - 17:00</td>
        </tr>
        <tr>
            <td>Lørdag</td>
            <td>10:00 - 15:00</td>
        </tr>
        <tr>
            <td>Søndag</td>
            <td>Stengt</td>
        </tr>
    `;
    document.body.appendChild(table);
}

function addCustomerList() {
    let customerHeader = document.createElement("h2");
    customerHeader.id = "fornoydekunder";  // Sett ID for ankerlenke
    customerHeader.innerText = "Tidligere fornøyde kunder";
    document.body.appendChild(customerHeader);

    let customerList = document.createElement("ul");
    customerList.innerHTML = `
        <li>Kari Normann - "Takk for en fantastisk oppfinnelse!"</li>
        <li>Ola Nordmann - "Dette endret livet mitt!"</li>
        <li>Per Hansen - "Imponerende resultater!"</li>
    `;
    document.body.appendChild(customerList);
}

function addMenu() {
    let menu = document.createElement("nav");
    menu.innerHTML = `
        <ul>
            <li><a href="#hjem">Hjem</a></li>
            <li><a href="#kontaktinfo">Kontaktinformasjon</a></li>
            <li><a href="#fornoydekunder">Fornøyde kunder</a></li>
        </ul>
    `;
    document.body.insertBefore(menu, document.body.firstChild); // Plasserer menyen øverst på siden
}

document.addEventListener("DOMContentLoaded", function() {
    petterSmart();
    addInventions();
    addContactInfoAndHours(); 
    addCustomerList();        
    addMenu();                
});
