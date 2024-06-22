function taskCheck(){
    // Getting values from the form fields
    const taskName = document.getElementById('taskName').value.trim();
    const taskDescription = document.getElementById('taskDescription').value.trim();
    const participantNumber = document.getElementById('playerNumber').value;
    const imgUrl = document.getElementById('imgActivity').value.trim();



    resetErrors()
    // field taskName verification
    if (!taskName || taskName.length < 2 || taskName.length > 50) {
        error("Le nom de la tâche doit comporter entre 2 et 50 caractères", "taskName");
        return false;
    }

    // field taskDescription verification
    if (!taskDescription || taskDescription.length < 10 || taskDescription.length > 400) {
        error("La description de la tâche doit être comprise entre 10 et 200 caractères", "taskDescription");
        return false;
    }

    // field playerNumber verification
    if (isNaN(participantNumber) || participantNumber < 1 || participantNumber > 60) {
        error("Le nombre de participants doit être compris entre 1 et 60", "playerNumber");
        return false;
    }

    // field imgUrl verification
    if (!imgUrl || imgUrl.length < 10 || imgUrl.length > 400) {
        error("La description de l'évenement doit être compris entre 10 et 200 caractères", "activitiesDescription");
        return false;
    }
   
    // When all validation are done, we return true
    return true;
}

function resetErrors() {
    // Erase previous error messages 
    const errors = document.querySelectorAll(".error");
    errors.forEach(message => message.remove());
}

function error(message, id) {
    //define error element
    let error = document.createElement("span")
    error.className = "error"
    error.textContent = message

    //defines on which field error is attached
    document.getElementById(id).parentNode.appendChild(error)
}