/**
 * WordPress dependencies.
 */
const {
	blocks: { createBlock },
	/* eslint-disable no-unused-vars */
	element: { createElement },
} = wp;

/**
 * Transforms for Bout de Code (Gist) embeds.
 */
const transforms = {
	from: [
		{
			type: 'raw',
			isMatch( node ) {
				return (
					node.nodeName === 'P' &&
					/^\s*(https?:\/\/gist\.github\.com\S+)\s*$/i.test(
						node.textContent
					)
				);
			},
			transform( node ) {
				return createBlock( 'imath/bout-de-code', {
					url: node.textContent.trim(),
				} );
			},
		},
	],
};

export default transforms;
