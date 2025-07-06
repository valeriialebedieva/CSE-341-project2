const router = require('express').Router();

router.use('/', require('./swagger'));
router.get('/', (req, res) => {
    res.send('Welcome!');
});

router.use('/books', require('./books'));
router.use('/authors', require('./authors'));

module.exports = router;