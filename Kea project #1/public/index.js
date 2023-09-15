let artistsData = [];
let showOnlyFavorites = false;

document.addEventListener("DOMContentLoaded", () => {
    // Intial load and render of artists, we also check if "favorite mode" is on
    fetch("/artists")
    .then(response => response.json())
    .then(data => {
        artistsData = data; 
        data.forEach(artist => {
                if (!artist.hasOwnProperty('favorite')) {
                artist.favorite = false;
            }
        });
        renderArtists(data); 
    });
    //Favorite function
    document.querySelector("#showFavorites").addEventListener("click", function() {
        showOnlyFavorites = !showOnlyFavorites; // Toggle the showOnlyFavorites flag
        this.textContent = showOnlyFavorites ? "Show All" : "Show Favorites";  // Toggle the button
        renderArtists(artistsData);  // Re-render based on flag
    });
});

function renderArtists(data) {
    const artistList = document.getElementById("artist-list").getElementsByTagName('tbody')[0];
    artistList.innerHTML = '';  

    data.forEach((artist) => {
        if (showOnlyFavorites && !artist.favorite) return; 
        
        const artistRow = document.createElement("tr");
        artistRow.innerHTML = `
        <td><button class="${artist.favorite ? 'unfavorite-btn' : 'favorite-btn'}" onclick="toggleFavorite(${artist.id})">${artist.favorite ? 'Unfavorite' : 'Favorite'}</button></td>
            <td>${artist.name}</td>
            <td>${artist.birthdate}</td>
            <td>${artist.activeSince}</td>
            <td>${artist.genres.join(', ')}</td>
            <td>${artist.labels.join(', ')}</td>
            <td><a href="${artist.website}" target="_blank">${artist.website}</a></td>
            <td><img src="${artist.image}" alt="${artist.name}" width="100" /></td>
            <td>${artist.shortDescription}</td>
            <td>
                <button onclick="viewArtist(${artist.id})">View</button>
                <button onclick="editArtist(${artist.id})">Edit</button>
                <button onclick="deleteArtist(${artist.id})">Delete</button>
            </td>
        `;
        artistList.appendChild(artistRow);
    });
}

function toggleFavorite(artistId) {
    const artist = artistsData.find(artist => artist.id === artistId);
    artist.favorite = !artist.favorite;  // Toggle the favorite status
    renderArtists(artistsData);  // Re-render the list
}

function viewArtist(artistId) {
    window.location.href = `/view_artist.html?id=${artistId}`;
}

function editArtist(artistId) {
    window.location.href = `/edit_artist.html?id=${artistId}`;
}

//the delete function, with a little confirmation of you actually want to delete the artist
function deleteArtist(artistId) {
    if (confirm("Are you sure you want to delete this artist?")) {
        fetch(`/artists/${artistId}`, {
            method: 'DELETE',
        })
        .then(response => response.json())
        .then(data => {
            // Refresh the page after deletion
            window.location.reload();
        });
    }
}
