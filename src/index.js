/**
 * WordPress dependencies.
 */
const {
	blocks: { registerBlockType },
	/* eslint-disable no-unused-vars */
	element: { createElement },
	i18n: { __ },
} = wp;

/**
 * Internal dependencies.
 */
import transforms from './inc/transforms';
import EditBoutDeCodeBlock from './inc/edit';
import SaveBoutDeCode from './inc/save';
import IconBoutDeCode from './inc/icon';

registerBlockType( 'imath/bout-de-code', {
	title: __( 'Bout de Code', 'bout-de-code' ),
	description: __(
		'Embarque des bouts de code hébergés sur Gist.GitHub.com dans votre publication.',
		'bout-de-code'
	),
	icon: IconBoutDeCode,
	category: 'embed',
	attributes: {
		url: {
			type: 'string',
		},
		caption: {
			type: 'string',
			source: 'html',
			selector: 'figcaption',
		},
	},
	supports: {
		align: true,
	},
	edit: EditBoutDeCodeBlock,
	save: SaveBoutDeCode,
	transforms,
} );
