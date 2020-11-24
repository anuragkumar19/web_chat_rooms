const express = require('express');
const { isValidObjectId } = require('mongoose');

const Room = require('../models/Room');

const router = express.Router();

router.use(express.urlencoded({ extended: false }));

// @route   GET /
// @desc    Home Page
router.get('/', (req, res) => res.render('index', { title: 'Home' }));

// @route   POST /
// @desc    Create Room
router.post('/', async (req, res) => {
    try {
        let { name, description } = req.body;

        if (typeof name != 'string') {
            res.render('index', {
                title: 'Home',
                error: 'Name of room not valid',
            });
        } else if (typeof description != 'string') {
            res.render('index', {
                title: 'Home',
                error: 'Description not valid',
            });
        } else {
            name = name.trim();
            description = description.trim();

            if (!name) {
                res.render('index', {
                    title: 'Home',
                    error: 'Name is required.',
                });
            } else if (!description) {
                res.render('index', {
                    title: 'Home',
                    error: 'Description id required.',
                });
            } else {
                let doc = await Room.create({
                    name,
                    desc: description,
                });

                res.render('index', {
                    title: 'Home',
                    success: `Room created. Room Id is ${doc._id} . You can join now! `,
                });
            }
        }
    } catch (err) {
        console.log(err);
        res.render('500', { title: 'Server Error' });
    }
});

// @route   GET /join
// @desc    Join Room
router.get('/join', async (req, res) => {
    let { roomId, name } = req.query;

    if (typeof roomId !== 'string') {
        return res.send('Room id not valid!');
    }

    if (typeof name !== 'string') {
        return res.send('Name id not valid!');
    }

    name = name.trim();
    roomId = roomId.trim();

    if (!roomId) {
        return res.send('Room id not valid!');
    }

    if (!name) {
        return res.send('Name id not valid!');
    } else {
        try {
            if (!isValidObjectId(roomId)) return res.send('Room Id not valid!');

            const room = await Room.findOne({ _id: roomId });

            if (!room) {
                return res.send('Room not found!');
            }

            res.render('room', {
                room,
                name,
            });
        } catch (err) {
            console.log(err);
            res.render('500');
        }
    }
});

// 404 Page
router.use(function (req, res, next) {
    res.status(404).render('400');
});
// 500p page
router.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).render('500');
});

module.exports = router;
