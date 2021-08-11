var express = require('express');
var router = express.Router();
var author = require('./author');



// define some moddleware
router.use((req, res, next) => {
    console.log(`Time: `, Date.now());
    next();
})

router.get('/', (req, res) => {
    author.home(req, res);
})

router.post('/create_process', (req, res) => {
    author.create_process(req, res);
});

router.get('/update', (req, res) => {
    author.update(req, res);
});

router.post('/update_process', (req, res) => {
    author.update_process(req, res);
});

router.post('/delete_process', (req, res) => {
    author.delete_process(req, res);
});

router.post('/sort_process', (req, res) => {
    author.sort_process(req, res);
})

router.post(`/sort_process_2`, (req, res) => {
    author.sort_process_2(req, res);
})



// module로서 export
module.exports = router;