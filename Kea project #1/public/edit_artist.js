document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const artistId = urlParams.get('id');
    
    //populates the edit form with the existing data.
    fetch(`/artists/${artistId}`)
        .then(response => response.json())
        .then(artist => {
            document.querySelector("#name").value = artist.name;
            document.querySelector("#birthdate").value = artist.birthdate;
            document.querySelector("#activeSince").value = artist.activeSince;
            document.querySelector("#genres").value = artist.genres;
            document.querySelector("#labels").value = artist.labels.join(', ');
            document.querySelector("#website").value = artist.website;
            document.querySelector("#shortDescription").value = artist.shortDescription;
           
        });
});

document.querySelector("#edit-artist-form").addEventListener("submit", function(event) {
    event.preventDefault();

    const urlParams = new URLSearchParams(window.location.search);
    const artistId = urlParams.get('id');

      // Manually gather form values
      const artistData = {
        id: artistId,
        name: document.querySelector("#name").value,
        birthdate: document.querySelector("#birthdate").value,
        activeSince: document.querySelector("#activeSince").value,
        genres: document.querySelector("#genres").value.split(",").map(genre => genre.trim()),
        labels: document.querySelector("#labels").value.split(",").map(label => label.trim()),
        website: document.querySelector("#website").value,
        shortDescription: document.querySelector("#shortDescription").value
    };

    fetch(`/artists/${artistId}`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(artistData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Artist updated successfully!");
            window.location.href = "/"; // Redirect back to the main page, for that smooth feeling :)
        } else {
            alert("Error updating artist. Please try again.");
        }
    })
    .catch(err => {
        console.error(err);
        alert("An error occurred. Please try again.");
    });
});