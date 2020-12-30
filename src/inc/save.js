/**
 * WordPress dependencies.
 */
const {
	blockEditor: { RichText },
	/* eslint-disable no-unused-vars */
	element: { createElement },
} = wp;

const SaveBoutDeCode = ( { attributes } ) => {
	const { url, caption, useDarkMode } = attributes;

	if ( ! url ) {
		return null;
	}

	let classNames = 'wp-block-embed wp-block-imath-bout-de-code';
	if ( useDarkMode ) {
		classNames += ' use-dark-mode';
	}

	return (
		<figure className={ classNames }>
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
