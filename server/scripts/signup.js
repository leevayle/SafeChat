const fs = require('fs');
const path = require('path');
const express = require('express');

const biodataFilePath = path.join(__dirname,"..",'data', 'biodata.json');

// Function to handle user registration
async function registerUser(newUser) {
  try {
    let users = [];

    if (fs.existsSync(biodataFilePath)) {
      const data = fs.readFileSync(biodataFilePath, 'utf8');
      users = JSON.parse(data);
    }

    if (!newUser.id_phn || !newUser.u_n) {
      return { success: false, message: 'Phone and username are required.' };
    }

    // Convert the id_phn from Base64 to a decimal string (assuming it's Base64 encoded)
    const decodedPhoneNumber = Buffer.from(newUser.id_phn, 'base64').toString('utf-8');

    // Check if the user already exists by id_phn or u_n
    const userExists = users.find(
      (u) => u.id_phn === decodedPhoneNumber || u.u_n === newUser.u_n
    );

    if (userExists) {
      return { success: false, message: 'You already have an account with this number :(' };
    }

    // Prepare the user object
    const userToAdd = {
      id_phn: decodedPhoneNumber, // Store the decoded phone number
      u_n: newUser.u_n,
      key: newUser.key || '',
      theme: newUser.theme || '',
      pass: newUser.pass || '',
      path:newUser.path || '',  
    };

    // Add the new user to the users array
    users.push(userToAdd);

    // Write the updated users array back to the file
    fs.writeFileSync(biodataFilePath, JSON.stringify(users, null, 2));

    return { success: true, message: 'User registered successfully!' };
  } catch (err) {
    console.error('Error registering user:', err);
    return { success: false, message: 'Internal server error.' };
  }
}

// Function to attach the registration route to the app
function setupRegistrationApi(app) {
  app.post('/register', async (req, res) => {
    const { id_phn, u_n, key, theme, pass, path } = req.body; // Include 'path'

    console.log('▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲', { id_phn, u_n, theme }); // Debugging line

    try {
      const result = await registerUser({ id_phn, u_n, key, theme, pass, path }); // Pass 'path'
      if (result.success) {
        res.status(201).json(result);
      } else {
        res.status(409).json(result); // Conflict if user already exists
      }
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ success: false, message: 'Internal server error.' });
    }
  });
}


module.exports = setupRegistrationApi;
