var cp = require( 'child_process' ),
    fs = require( 'fs' ),
    path = require( 'path' ),
    wrench = require( 'wrench' ),
    uuid = require( 'node-uuid' ),
    markdown = require( 'markdown' ).markdown;

function Generator() {
    this.format = '--book';
}

Generator.prototype.set = function( option, value ) {
    switch( option ) {
        case 'format':
            this.format = '--' + value;
            break;
        case 'output':
            this.output = value;
            break;
        case 'input':
            this.input = value;
            break;
    }
    return this;
};

Generator.prototype.generate = function() {
    // We need to transform all the files to html
    mdToHTML.bind( this )();

    // Then we can use htmldoc
    runHtmldoc.bind( this )();

    // And we need to clean up temporary files
    deleteTempFiles.bind( this )();
};

// Get each file and transform it to HTML into temporary files
function mdToHTML() {
    // Generate a temporary folder
    // As to not conflict with another folder,
    // a UUID is used to generate it.
    this.tempFolder = uuid.v4();
    fs.mkdirSync( this.tempFolder );
    process.chdir( this.tempFolder );

    var originalFiles = this.input.slice( 0 );

    // Empty the this.input
    this.input = [];

    originalFiles.forEach( function( file ) {
        // Get the content of the markdown file
        var content = fs.readFileSync( path.join( '..', file ), 'utf-8' );

        // Transform it to HTML
        var htmlContent = markdown.toHTML( content );

        // Get the name of the new file
        var newName = file.slice( 0, -3 ) + '.html';

        // Write the file to the temporary folder
        fs.writeFileSync( newName, htmlContent );

        // And add it to this.input
        this.input.push( path.join( this.tempFolder, newName ) );
    }, this );

    // Go back to original folder
    process.chdir( '..' );
}

// Run the htmldoc application after building the correct command to run
function runHtmldoc() {
    // Build the command
    var command = 'htmldoc ' + this.format + ' ';

    // We need to check if every option exist
    if ( this.output === '' ) exit( 'You need to specify the output.' );
    if ( this.input.length === 0 ) exit( 'You need to specify input file(s)' );

    // Now add each option
    command += '-f ' + this.output + ' ';
    command += this.input.join( ' ' );

    cp.exec( command, function( err, stdout, stderr ) {
        if ( err ) throw err;
        process.stdout.write( stdout );
    });
}

// Delete the temporary folder :-)
function deleteTempFiles() {
    wrench.rmdirSyncRecursive( this.tempFolder );
}

// Convenience method
function exit( message ) {
    console.error( message );
    process.exit( -1 );
}

module.exports = new Generator();

