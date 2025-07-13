/**
 * WP dependencies.
 */
import { createBlock } from '@wordpress/blocks';

/**
 * Transforms for Bout de code (Gist) embeds.
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
