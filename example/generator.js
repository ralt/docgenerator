var generator = require( 'docgenerator' ),
    path = require( 'path' ),
    fs = require( 'fs' );

// Get all the markdown files in this folder
var files = fs.readdirSync( '.' );

files = files
    .filter( function( file ) {
        return file.substr( -3 ) === '.md';
    })
    .sort();

generator
    .set( 'title', 'Official documentation of tartempion' )
    .set( 'toc', true )
    .set( 'table', true )
    .set( 'files', files )
    .set( 'output', 'documentation.html' )
    .generate();

