/**
 * WordPress dependencies.
 */
const {
	blockEditor: { RichText },
	/* eslint-disable no-unused-vars */
	element: { createElement },
} = wp;

const SaveBoutDeCode = ( { attributes } ) => {
	const { url, caption } = attributes;

	if ( ! url ) {
		return null;
	}

	return (
		<figure className="wp-block-embed is-bout-de-code">
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
