/**
 * WP dependencies.
 */
import { registerBlockType } from '@wordpress/blocks';

/**
 * Internal dependencies.
 */
import './index.scss';
import metadata from './block.json';
import transforms from './inc/transforms';
import EditBoutDeCodeBlock from './inc/edit';
import SaveBoutDeCode from './inc/save';
import IconBoutDeCode from './inc/icon';

registerBlockType( metadata, {
	icon: IconBoutDeCode,
	edit: EditBoutDeCodeBlock,
	save: SaveBoutDeCode,
	transforms,
} );
