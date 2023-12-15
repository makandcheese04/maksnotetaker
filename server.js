const express = require('express');
const path = require('path');
const fs = require('fs');
const uuid = require('uuid');

let jsonData = JSON.parse(fs.readFileSync('db/db.json', 'utf8'));

const app = express();
const PORT = process.env.PORT || 3001;

//Middleware
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Get requests
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/notes.html'));
});

app.get('/api/notes', (req, res) => {
    res.json(jsonData);
});
//Post request
app.post('/api/notes', (req, res) =>{
    const {title, text} = req.body;

    console.log('req.body:', req.body)

    if(title && text) {
        const postNote = {
            title,
            text,
            id: uuid(),
        };

        jsonData.push(postNote);

        fs.writeFileSync('db/db.json', JSON.stringify(jsonData), (err) => {
            if (err) throw err; 
            console.log('Data written to file successfully');
            res.status(201).json(response);
        });
        const response = {
            status: 'Success!',
            body: postNote,
        };
        res.status(201).json(response);
    } else {
        res.status(400).json('Note failed to post!')
    }
});
//Delete Request
app.delete("/api/notes/:id", function (req, res) {
    
    jsonData = jsonData.filter(({ id }) => id !== req.params.id);
    
    fs.writeFileSync('./db/db.json', JSON.stringify(jsonData),(err) => {
            if (err) throw err;
            console.info('Successfully deleted notes!')
        });
        res.status(204).send();
});

app.listen(PORT, () =>
console.log(`Maks APP listening at http://localhost:${PORT}`)
);