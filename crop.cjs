const { Jimp } = require('jimp');

Jimp.read('public/logo.png')
  .then(image => {
    image.autocrop();
    image.write('public/logo-cropped.png');
    console.log('Cropped successfully');
  })
  .catch(err => {
    console.error(err);
  });
