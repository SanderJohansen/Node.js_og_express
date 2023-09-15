document.querySelector("#add-artist-form").addEventListener("submit", function(event) {
    event.preventDefault();
    
    // Manually gather form values
    const artistData = {
        name: document.querySelector("#name").value,
        birthdate: document.querySelector("#birthdate").value,
        activeSince: document.querySelector("#activeSince").value,
        genres: document.querySelector("#genres").value.split(",").map(genre => genre.trim()),
        labels: document.querySelector("#labels").value.split(",").map(label => label.trim()),
        website: document.querySelector("#website").value,
        shortDescription: document.querySelector("#shortDescription").value
    };

    console.log("Artist Data:", artistData);
    
    fetch("/artists", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(artistData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Artist added successfully!");
            window.location.href = "/"; // Redirect back to the main page, for that smooth feeling :)
        } else {
            alert("Error adding artist. Please try again.");
        }
    })
    .catch(err => {
        console.error(err);
        alert("An error occurred. Please try again.");
    });
});