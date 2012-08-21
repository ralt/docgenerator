var fs = require( 'fs' ),
    path = require( 'path' );

module.exports = {
    getStyles: function( theme ) {
        var themePath;
        if ( /^custom:/.test( theme ) ) {
            // This is a custom theme
            themePath = path.join( theme.split( ':' ).reverse()[ 0 ] );
        }
        else {
            // This is a theme provided by docgenerator
            themePath = path.join( __dirname, '..', 'themes', theme );
        }
        return this.getContent( {
            openTag: '<style>\n',
            type: '.css',
            closeTag: '</style>',
            path: themePath
        });
    },

    getScripts: function( theme ) {
        var themePath;
        if ( /^custom:/.test( theme ) ) {
            // This is a custom theme
            themePath = path.join( theme.split( ':' ).reverse()[ 0 ] );
        }
        else {
            // This is a theme provided by docgenerator
            themePath = path.join( __dirname, '..', 'themes', theme );
        }
        return this.getContent( {
            openTag: '\n<script>\n',
            type: '.js',
            closeTag: '</script>',
            path: themePath
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

