const { override, fixBabelImports, addLessLoader } = require('customize-cra');
module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd-mobile',

    style: true,
  }),

  addLessLoader({
    javascriptEnabled: true,

    modifyVars: {
      //other...
      "@brand-primary":"#33A7FF"
    }
  })
);