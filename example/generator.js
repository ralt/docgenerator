var generator = require( 'docgenerator' ),
    fs = require( 'fs' );

// Get all the markdown files in this folder
var files = fs.readdirSync( '.' );

files = files.filter( function( file ) {
    return file.substr( -3 ) === '.md';
});

generator
    .set( 'format', 'book' )
    .set( 'output', 'documentation.html' )
    .set( 'input', files )
    .generate();

