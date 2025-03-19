const express = require('express');
const app = express();
app.use(express.json());

//In-memory data store (can be replaced with a database)
let dataStore = {};

// Function to generate a new unique ID
const generateId = () => {
  return Object.keys(dataStore).length + 1;
};
// GET
app.get('/api/data', (req, res) => {
  return res.status(200).json(Object.values(dataStore));
});
// POST: 
app.post('/api/data', (req, res) => {
  const { firstname, lastname, age, designation } = req.body;
  if (!firstname || !lastname || !age || !designation) {
    return res.status(400).json({ message: 'All fields (firstname, lastname, age, designation) are required' });
  }

  const newId = generateId();
  const newData = { id: newId, firstname, lastname, age, designation };
  dataStore[newId] = newData;

  return res.status(201).json(newData);
});
// PUT
app.put('/api/data', (req, res) => {
  const { id, newFirstname, newLastname, newAge, newDesignation } = req.body;

  if (!id) {
    return res.status(400).json({ message: 'ID is required' });
  }

  let updatedData = dataStore[id];

  if (updatedData) {
    updatedData.firstname = newFirstname || updatedData.firstname;
    updatedData.lastname = newLastname || updatedData.lastname;
    updatedData.age = newAge || updatedData.age;
    updatedData.designation = newDesignation || updatedData.designation;

    return res.status(200).json(updatedData);
  } else {
    return res.status(404).json({ message: 'Data not found' });
  }
});
// PATCH
app.patch('/api/data', (req, res) => {
  const { patchId, patchFirstname, patchLastname, patchAge, patchDesignation } = req.body;

  if (!patchId) {
    return res.status(400).json({ message: 'ID is required' });
  }

  let patchData = dataStore[patchId];

  if (patchData) {
    if (patchFirstname) patchData.firstname = patchFirstname;
    if (patchLastname) patchData.lastname = patchLastname;
    if (patchAge) patchData.age = patchAge;
    if (patchDesignation) patchData.designation = patchDesignation;

    return res.status(200).json(patchData);
  } else {
    return res.status(404).json({ message: 'Data not found' });
  }
});
// DELETE
app.delete('/api/data', (req, res) => {
  const { deleteId } = req.body;

  if (!deleteId) {
    return res.status(400).json({ message: 'ID is required' });
  }

  if (dataStore[deleteId]) {
    delete dataStore[deleteId];
    return res.status(200).json({ message: 'Data deleted successfully' });
  } else {
    return res.status(404).json({ message: 'Data not found' });
  }
});
// Default error handling for unsupported HTTP methods
app.all('*', (req, res) => {
  res.status(405).json({ message: `Method ${req.method} not allowed` });
});
// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
