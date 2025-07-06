const router = require('express').Router();

router.use('/', require('./swagger'));
router.get('/', (req, res) => {
    res.send('Welcome!');
});

router.use('/contacts', require('./contacts'));

module.exports = router;