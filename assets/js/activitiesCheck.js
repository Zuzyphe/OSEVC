
function activitiesCheck(){
    // Récupération des valeurs des champs du formulaire
    const activitiesName = document.getElementById('activitiesName').value.trim();
    const activitiesDescription = document.getElementById('activitiesDescription').value.trim();
    const activitiesDate = document.getElementById('activitiesDate').value;
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    const activitiesTime = document.getElementById('activitiesTime').value.trim();
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    const playersNumber = document.getElementById('playersNumber').value;
    const address = document.getElementById('address').value.trim();
    const addressRegex  = /^.{3,}$/;

    // Vérification du champ activitiesName
    if (!activitiesName || activitiesName.length < 2 || activitiesName.length > 20) {
        error("Le nom de l'activité doit comporter entre 2 et 20 caractères", "activitiesName");
        return false;
    }

    // Vérification du champ activitiesDescription
    if (!activitiesDescription || activitiesDescription.length < 10 || activitiesDescription.length > 200) {
        error("La description de l'activité doit être compris entre 10 et 200 caractères", "activitiesDescription");
        return false;
    }

    // Vérification du champ activitiesDate
    if (!activitiesDate || !dateRegex.test(activitiesDate)) {
        error("La date doit être valide", "activitiesDate");
        return false;
    }

    // Vérification du champ activitiesTime
    if (!activitiesTime || !timeRegex.test(activitiesTime)) {
        error("L'heure doit être au format 24heures", "activitiesTime");
        return false;
    }

     // Vérification du champ address
     if (!address || !addressRegex.test(address)) {
        error("L'addresse doit contenir au moins 3 caractères", "address");
        return false;
    }

    // Vérification du champ playersNumber
    if (isNaN(playersNumber) || playersNumber < 1 || playersNumber > 60) {
        error("Le nombre de participants doit être compris entre 1 et 60", "playersNumber");
        return false;
    }

   
    // Toutes les validations ont réussi, donc on retourne true
    return true;
}

function resetErrors() {
    // Enlève les messages d'erreur précédents 
    const errors = document.querySelectorAll(".error");
    errors.forEach(message => message.remove());
}

function error(message, id) {
    //définit l'élément error 
    let error = document.createElement("span")
    error.className = "error"
    error.textContent = message

    //définit le champ auquel error est rattaché -- defines on which field error is attached
    document.getElementById(id).parentNode.appendChild(error)
}