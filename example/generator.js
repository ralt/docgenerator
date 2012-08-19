var generator = require( 'docgenerator' );

generator
    .set( 'format', 'book' )
    .set( 'output', 'documentation.html' )
    .set( 'input', [ 'some.md', 'some2.md' ] )
    .generate();

