"use strict";

module.exports = function (grunt) {

  grunt.loadNpmTasks("grunt-contrib-connect");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-contrib-coffee");
  grunt.loadNpmTasks("grunt-simple-mocha");


  grunt.registerTask("jison", "generate jison parser", function() {

    // require 'jison'
    var parser = require("./src/js/parser/grammar").parser;
    var str = "(function(factory) {\n" +
      "  if (typeof define === 'function' && define.amd) {\n" +
      "    return define([], factory);\n" +
      "  } else {\n" +
      "    module.exports = factory();\n"+
      "  }\n"+
      "})(function() {\n"+
      parser.generate({moduleType: "js"}) +
      "\n"+
      "return parser.Parser;\n"+
      "});";
    var fs = require("fs");
    fs.writeFileSync("./src/js/parser/parser.js", str);
  });

  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),

    /*
    Create jison parser
    */
    jison: {
      grammar:  "./src/js/parser/jisonParser/grammar.js",
      dest:     "./src/js/parser/jisonParser/"
    },

    /*
    Connect. Create a static web server.
    */
    connect: {
      dev: {
        options: {
          port: 8765,
          base: "."
        }
      },
      test: {
        options: {
          port: 8790,
          base: "."
        }
      }
    },

    /*
    simplemocha. Run mocha specs in Node.
    */
    simplemocha: {
      options: {
        globals: [],
        timeout: 3000,
        ignoreLeaks: false,
        ui: "bdd",
        reporter: "dot",
        bail: true
      },
      all: { src: [
        "./src/js/specs/**/*.js"
      ]}
    },

    /*
    Coffee. Converts coffeescript files to JS files.
    */
    coffee: {
      engine: {
        options: {
          bare: true
        },
        files: [{
          expand: true,            // Enable dynamic expansion.
          cwd: "src/coffee",   // Src matches are relative to this path.
          src: ["**/*.litcoffee", "**/*.coffee"], // Actual pattern(s) to match.
          dest: "src/js",      // Destination path prefix.
          ext: ".js",              // Dest filepaths will have this extension.
        }]
      }
    },

    /*
    Clean. Empties temp folders.
    */
    clean: {
      engineJS: ["src/js"]
    },


    /*
    Watch. Kicks off tasks based on fileChanged events.
    See the run tasks to see how these watch tasks are used.
    */
    watch: {
      // engine
      engine: {
        files: ["src/coffee/**/*.{coffee,litcoffee}"],
        tasks: ["clean:engineJS", "coffee:engine", "jison", "simplemocha"]
      }
    }

  });

  // Build Tasks
  grunt.registerTask("test:engine", [
    "simplemocha"
  ]);

  // Run connect and watchers for everything
  grunt.registerTask("run", [
    "connect:dev",
    "watch"
  ]);

};
