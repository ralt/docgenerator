"use strict";

var cp = require( 'child_process' ),
    fs = require( 'fs' ),
    theme = require( './theme.js' ),
    uuid = require( 'node-uuid' );

module.exports = {
    /**
     * This method just sets the properties.
     */
    set: function( prop, value ) {
        // First, set the list of allowed properties and their type
        var properties = {
            'toc': 'Boolean',
            'table': 'Boolean',
            'title': 'String',
            'files': 'Array',
            'output': 'String',
            'theme': 'String'
        };

        // Throw an error if the property doesn't exist
        if ( !~Object.keys( properties ).indexOf( prop ) ) {
            throw new Error( "The property " + prop + " doesn't exist." );
        }

        // Then, check if the type is correct
        if ( {}.toString.apply( value ) !== '[object ' + properties[ prop ] + ']' ) {
            throw new Error( "The property " + prop + " doesn't have the correct type." );
        }

        // If everything went fine, just add the property
        this[ prop ] = value;
        return this;
    },

    /**
     * This method generates the final HTML file.
     *
     * To do this, it needs to do several steps:
     *   - Get all the markdown files and add the text
     *     to a single temporary file.
     *   - Set all the markdown_py options.
     *   - Run markdown_py.
     */
    generate: function() {
        var that = this;

        // Create a temporary filename
        this.tempFile = uuid.v4();

        // Append the meta first
        fs.appendFileSync( this.tempFile, getHead.bind( this )() );

        // If there is a title, we need to append it first
        if ( this.title ) {
            var title = '<div class="title">' + this.title + '</div>\n\n';
            fs.appendFileSync( this.tempFile, title );
        }

        // Same if there is a table of contents
        if ( this.toc ) {
            fs.appendFileSync( this.tempFile, '[TOC]\n\n' );
        }

        // Now get all the md files
        this.files.forEach( function( file ) {

            // Get the content of the file
            var content = fs.readFileSync( file, 'utf-8' );

            // Append it to the temporary file
            fs.appendFileSync( that.tempFile, content );
        });

        // Now, everything is correctly added in the temp file,
        // so we can transform everything with markdown_py.
        // For this, we need to build up the command.
        var command = "markdown_py --output_format='html5' ";

        if ( this.toc ) {
            command += '-x toc ';
        }
        if ( this.table ) {
            command += '-x table ';
        }

        command += this.tempFile + ' ';

        command += '> ' + this.output;

        // Execute the command
        cp.exec( command, function( err, stdout, stderr ) {
            if ( err ) throw err;

            // Append the header

            // Now append a little string to the generated file
            fs.appendFileSync( that.output, getFoot.bind( that )() );

            // Delete the temporary file
            fs.unlinkSync( that.tempFile );

            console.log( '\nDocumentation generated at \u001b[32m' + that.output + '\u001b[0m\n' );
        });
    }
};

function getHead() {
    var head = '<!doctype html>\n';
    head += '<html><head>\n';
    head += '<meta charset="utf-8">\n';
    head += '<title>' + this.title + '</title>\n';

    // Now, check if we have a theme there
    if ( this.theme ) {
        head += theme.getStyles( this.theme );
    }

    head += '</head><body>\n';
    return head;
}

function getFoot() {
    // Add one extra line at the end to avoid problems
    // with git diffs.
    var footer = '\n\n';

    // Add a "made with docgenerator" link there
    footer += '<div class="copyright">Documentation generated with <a href="https://npmjs.org/package/docgenerator">docgenerator</a>.</div>';

    // Check if we have a theme there
    if ( this.theme ) {
        footer += theme.getScripts( this.theme );
    }

    footer += '\n</body></html>\n\n';

    return footer;
}

