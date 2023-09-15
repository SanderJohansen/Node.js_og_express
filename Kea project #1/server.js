const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

// Middlewares
app.use(express.json());
const bodyParser = require('body-parser');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true })); //this is for the incoming post method, currently it isnt working, so maybe this fixes it
app.use('/path_to_images', express.static('public/images')); //had to steal this from the internet. Clunky AF, its use to define the path to the pictures.

// Utility to save data to file
function saveDataToFile() {
    fs.writeFileSync('data.json', JSON.stringify(jsonData), 'utf-8');
}

// Read the JSON data from the file
const jsonData = JSON.parse(fs.readFileSync('data.json', 'utf-8'));

// Define a route to serve the intial index page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

//route for if you click the view button, i want the normal api call to work, but it didnt, so i am trying a new approach
app.get('/artists/:id', (req, res) => {
    const artistId = parseInt(req.params.id);
    const artist = jsonData.artists.find((a) => a.id === artistId);
  
    if (!artist) {
        return res.status(404).send('Artist not found');
    }
  
    res.json(artist);  // Send the artist data as a JSON response
  });

// Retrieve all artists
app.get('/artists', (req, res) => {
    const artists = jsonData.artists;
    res.json(artists);
});

app.get('/artists/:id', (req, res) => {
  const artistId = parseInt(req.params.id);
  const artist = jsonData.artists.find((a) => a.id === artistId);

  if (!artist) {
      return res.status(404).send('Artist not found');
  }
  res.render('view_artist', artist);  
});

// POST method to add new artist
app.post('/artists', (req, res) => {
    const defaultImage = "/images/default.png";
    const newArtist = {
        id: jsonData.artists.length + 1,
        name: req.body.name,
        birthdate: req.body.birthdate,
        activeSince: req.body.activeSince, 
        genres: req.body.genres,
        labels: req.body.labels,
        website: req.body.website,
        image: defaultImage, // I just put a default picture when you add a new artist, cause the upload of a new picture seemed out of scope
        shortDescription: req.body.shortDescription
    };

    jsonData.artists.push(newArtist);
    
    fs.writeFile('data.json', JSON.stringify(jsonData, null, 2), (err) => {
        if (err) {
            console.error('Error writing to the file:', err);
            return res.status(500).json({ success: false, message: 'Error saving the artist.' });
        }
        
        res.json({ success: true });
    });
});

app.put('/artists/:id', (req, res) => {
    const artistId = parseInt(req.params.id, 10);
    const artistIndex = jsonData.artists.findIndex(artist => artist.id === artistId);
    if (artistIndex > -1) {
        // Preserving the image and overwriting all other properties
        const updatedArtist = {...req.body, image: jsonData.artists[artistIndex].image};
        jsonData.artists[artistIndex] = updatedArtist;
        
        // Save jsonData back to the file
        fs.writeFile('data.json', JSON.stringify(jsonData, null, 2), (err) => {
            if (err) {
                console.error('Error writing to the file:', err);
                return res.status(500).json({ success: false, message: 'Error updating the artist.' });
            }
            res.json({ success: true });
        });
    } else {
        res.status(404).json({ success: false, message: 'Artist not found' });
    }
});

// DELETE method to remove artist by ID
app.delete('/artists/:id', (req, res) => {
    const artistId = parseInt(req.params.id);
    const index = jsonData.artists.findIndex((a) => a.id === artistId);

    if (index === -1) {
        return res.status(404).json({ error: 'Artist not found' });
    }

    const deletedArtist = jsonData.artists.splice(index, 1)[0];
    saveDataToFile();

    res.json(deletedArtist);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
