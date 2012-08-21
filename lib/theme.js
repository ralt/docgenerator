var fs = require( 'fs' ),
    path = require( 'path' );

module.exports = {
    getStyles: function( theme ) {
        return this.getContent( {
            openTag: '<style>\n',
            type: '.css',
            closeTag: '</style>',
            path: path.join( __dirname, '..', 'themes', theme )
        });
    },

    getScripts: function( theme ) {
        return this.getContent( {
            openTag: '\n<script>\n',
            type: '.js',
            closeTag: '</script>',
            path: path.join( __dirname, '..', 'themes', theme )
        });
    },

    getContent: function( type ) {
        var content = type.openTag;
        if ( /^custom:/.test( this.theme ) ) {
            // This is a custom theme
        }
        else {
            // This is a theme provided by docgenerator

            // Get all the filenames
            this.files = this.files || fs.readdirSync( type.path );

            // Filter by type
            var files = this.files.filter( function( file ) {
                return file.substr( -type.type.length ) === type.type;
            });

            // Add the content
            files.forEach( function( file ) {
                content += fs.readFileSync( path.join( type.path, file ) );
            });
        }
        content += type.closeTag

        // We need to remove all double newlines
        while ( /\n\n/.test( content ) ) {
            content = content.replace( /\n\n/g, '\n' );
        }
        return content;
    }
};

