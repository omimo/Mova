var webpack = require("webpack");
var fs = require("fs");
var minimize = process.argv.indexOf('-p') ==! -1 ? true : false;
var plugins =  [
    new webpack.BannerPlugin(fs.readFileSync('./LICENSE', 'utf8')),
    new webpack.EnvironmentPlugin('NODE_ENV')
  ];

minimize && plugins.push(new webpack.optimize.UglifyJsPlugin());

module.exports = {
    entry: {Mova: ["./src/Mova.js"]},
    devtool: "source-map",
    output: {
        path: __dirname+"/dist/",
        filename: "[name]" + (minimize ? ".min." : ".") + "js"
    },
    module: {

    },
    plugins: plugins
};