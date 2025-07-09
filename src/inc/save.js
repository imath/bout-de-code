/**
 * WP dependencies.
 */
import { RichText, useBlockProps } from '@wordpress/block-editor';

const SaveBoutDeCode = ( { attributes } ) => {
	const { url, caption, useDarkMode } = attributes;

	if ( ! url ) {
		return null;
	}

	let classNames = 'wp-block-embed wp-block-imath-bout-de-code';
	if ( useDarkMode ) {
		classNames += ' use-dark-mode';
	}

	const blockProps = useBlockProps.save( {
		className: classNames,
	} );

	return (
		<figure { ...blockProps }>
			<div className="wp-block-embed__wrapper">
				{ `\n${ url }\n` /* URL needs to be on its own line. */ }
			</div>
			{ ! RichText.isEmpty( caption ) && (
				<RichText.Content tagName="figcaption" value={ caption } />
			) }
		</figure>
	);
};

export default SaveBoutDeCode;
