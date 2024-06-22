function updateUserRole(userId, newRole) {
    // Appel à une API ou à une base de données pour mettre à jour le rôle de l'utilisateur
    fetch('/api/users/' + userId, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ role: newRole })
    })
   .then(response => response.json())
   .then(data => console.log(`Le rôle de l'utilisateur ${userId} a été mis à jour en ${newRole}`))
   .catch(error => console.error('Erreur lors de la mise à jour du rôle de l\'utilisateur:', error));
  }