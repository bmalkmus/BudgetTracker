const webpackManifest = require("webpack-pwa-manifest");
const path = require("path");

const config = {
    entry: {
        online: "./public/index.js",
    },
    output: {
        path: __dirname + "/public/dist",
        filename: "[name].bundle.js"
      },
    mode: "production",
    module: {
    rules: [
        {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: "babel-loader",
                options: {
                    presets: ["@babel/preset-env"]
                }
            }
        }
    ]
},
    plugins: [
        new webpackManifest ({
            name: "Budget App",
            short_name: "Budget",
            description: "An application to track where your spending",
            background_color: "#ffffff",
            theme_color: "#ffffff",
            "theme-color": "#ffffff",
            start_url: "/",
            icons: [{
                src: path.resolve("./public/icons/icon-192x192.png"),
                sizes: [96, 128, 192, 384, 512],
                destination: path.join ("assets", "icons")
            }]

        })
    ]    
};
module.exports = config;