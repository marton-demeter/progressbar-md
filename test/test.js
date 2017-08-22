const progressbar = require('../progressbar-md.js');

progressbar.on('complete', () => {
  process.exit();
});

progressbar.update(25,{
  message: 'Message 1...',
});
setTimeout(function() {
  progressbar.update(50,{
    message: 'Message 2...'
  });
}, 1500)
setTimeout(function() {
  progressbar.update(75,{
    message: 'Message 3...'
  });
}, 3000)
setTimeout(function() {
  progressbar.update(100,{
    message: 'Message 4...',
    fmessage: 'Finished!'
  });
}, 4500)