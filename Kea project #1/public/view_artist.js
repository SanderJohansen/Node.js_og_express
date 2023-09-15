document.addEventListener("DOMContentLoaded", function() {
    const params = new URLSearchParams(window.location.search);
    const artistId = params.get('id');

    fetch(`/artists/${artistId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Artist with ID ${artistId} not found`);
            }
            return response.json();
        })
        .then(artist => {
            document.querySelector("#artistName").textContent = artist.name;
            document.querySelector("#artistBirthdate").textContent = artist.birthdate;
            document.querySelector("#artistActiveSince").textContent = artist.activeSince;
            document.querySelector("#artistGenres").textContent = artist.genres.join(', ');
            document.querySelector("#artistLabels").textContent = artist.labels.join(', ');

            const artistWebsiteLink = document.querySelector("#artistWebsite");
            artistWebsiteLink.href = artist.website;
            artistWebsiteLink.textContent = artist.website;
            document.querySelector("#artist-image").src = artist.image;
            document.querySelector("#artistDescription").textContent = artist.shortDescription;
        })
        .catch(error => console.error('Error:', error));
});
