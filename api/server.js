// BUILD YOUR SERVER HERE
const express = require('express')
const user = require('./users/model')

const server = express()

server.use(express.json())

server.post('/api/users', (req, res) => {
    // Storing Values
    const { name, bio } = req.body
    // const name = req.body.name
    // const bio = req.body.bio

    // Checking for name and bio
    if (name === undefined || bio === undefined) {
        return res.status(400).json({ message: 'Please provide name and bio for the user' })
    } else {
        user.insert({ name, bio })
        .then(object => {
            res.status(201).json(object)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ message: 'There was an error while saving the user to the database'})
        })
    }
})

server.get('/api/users', (req, res) => {
    user.find()
    .then(object => {
        res.json(object)
    })
})

server.get('/api/users/:id', (req, res) => {
    // Storing Id 
    const { id } = req.params

    user.findById(id)
    .then(object => {
        if (object) {
            res.status(200).json(object)
        } else {
            res.status(404).json({ message: 'The user with the specified ID does not exist'})
        }
    })
    .catch(err => {
        console.log(err)
        res.status(500).status.json({ message: 'The user information could not be retrieved'})
    })
})

server.delete('/api/users/:id', async (req, res) => {
    // Storing id 
    const { id } = req.params
    const userProfile = await user.findById(id)

    if (userProfile) {
        user.remove(id)
        .then(results => {
            res.status(200).json(results)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ message: 'The user could not be removed'})
        })
    } else {
        return res.status(404).json({ message: 'The user with the specified ID does not exist'})
    }
})

server.put('/api/users/:id' , async (req, res) => {
    // Storing values
    const { id } = req.params
    const { name, bio } = req.body
    const body = req.body
    const userProfile = await user.findById(id)

    // Checking if name, bio, and user exist
    if (name === undefined || bio === undefined) {
        return res.status(400).json({ message: 'Please provide name and bio for the user'})
    } else if ( userProfile === undefined ) {
        return res.status(404).json({ message: 'The user with the specified ID does not exist'})
    }

    user.update(id, body)
    .then(results => {
        res.status(200).json(results)
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({ message: 'The user information could not be modified'})
    })
})

module.exports = server // EXPORT YOUR SERVER instead of {}
