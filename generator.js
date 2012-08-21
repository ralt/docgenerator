var generator = require( 'docgenerator' ),
    path = require( 'path' ),
    fs = require( 'fs' );

// Get all the markdown files in this folder
var files = fs.readdirSync( 'original' );

files = files
    .filter( function( file ) {
        return file.substr( -3 ) === '.md';
    })
    .map( function( file ) {
        return path.join( 'original', file );
    })
    .sort();

generator
    .set( 'title', 'Official documentation of docgenerator' )
    .set( 'toc', true )
    .set( 'files', files )
    .set( 'output', 'index.html' )
    .set( 'theme', 'default' )
    .generate();

