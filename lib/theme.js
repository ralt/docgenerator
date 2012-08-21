var fs = require( 'fs' ),
    path = require( 'path' );

module.exports = {
    getStyles: function( theme ) {
        var styles = '<style>\n';
        if ( /^custom:/.test( theme ) ) {
            // This is a custom theme
        }
        else {
            // This is a theme provided by docgenerator

            // Get all the css filenames
            var cssFiles = fs.readdirSync(
                path.join( __dirname, '..', 'themes', theme )
            );

            cssFiles = cssFiles.filter( function( file ) {
                return file.substr( -4 ) === '.css';
            });

            // Add the content of each file
            cssFiles.forEach( function( file ) {
                styles += fs.readFileSync(
                    path.join( __dirname, '..', 'themes', theme, file )
                );
            });
        }
        styles += '</style>';

        // We need to remove all new lines
        styles = styles.replace( /\n/g, '' );
        return styles;
    },

    getScripts: function( theme ) {
        var scripts = '\n<script>\n';
        if ( /^custom:/.test( theme ) ) {
            // This is a custom theme
        }
        else {
            // This is a theme provided by docgenerator

            // Get all the js filenames
            var jsFiles = fs.readdirSync(
                path.join( __dirname, '..', 'themes', theme )
            );

            jsFiles = jsFiles.filter( function( file ) {
                return file.substr( -3 ) === '.js';
            });

            // Add the content of each file
            jsFiles.forEach( function( file ) {
                scripts += fs.readFileSync(
                    path.join( __dirname, '..', 'themes', theme, file )
                );
            });
        }
        scripts += '</script>';

        // We need to remove all newlines
        scripts = scripts.replace( /\n/g, '' );
        return scripts;
    }
};

