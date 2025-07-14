// const path = require('path');
// const prettier = require('prettier');

module.exports = function (eleventyConfig) {
  // eleventyConfig.addFilter('isoString', (date = Date.now()) =>
  //   new Date(date).toISOString()
  // );

  // eleventyConfig.addTransform('prettier', function (content, outputPath) {
  //   const extname = path.extname(outputPath);
  //   switch (extname) {
  //     case '.html':
  //     case '.json':
  //       // Strip leading period from extension and use as the Prettier parser.
  //       const parser = extname.replace(/^./, '');
  //       return prettier.format(content, { parser });

  //     default:
  //       return content;
  //   }
  // });

  // Return your Object options:
  return {
    dir: {
      input: 'src/html',
      includes: '_includes',
      templateFormats: 'ejs',
      output: 'dist',
      data: '_data',
    },
  };
};
