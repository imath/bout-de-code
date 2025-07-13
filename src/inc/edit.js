/**
 * WP dependencies.
 */
import {
	InspectorControls,
	RichText,
	BlockControls,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	Placeholder,
	PanelBody,
	ToggleControl,
	SandBox,
	Button,
	Spinner,
	ToolbarGroup,
	ToolbarButton,
} from '@wordpress/components';
import { compose } from '@wordpress/compose';
import { withSelect } from '@wordpress/data';
import {
	useState,
	useEffect,
} from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import IconBoutDeCode from './icon';

const EditBoutDeCode = ( {
	attributes,
	setAttributes,
	isSelected,
	preview,
	fetching,
} ) => {
	const blockProps = useBlockProps();
	const { url, caption, useDarkMode } = attributes;
	const label = __( 'Bout de code', 'bout-de-code' );
	const [ value, setURL ] = useState( url );
	const [ isEditingURL, setIsEditingURL ] = useState( ! url );
	const [ isSettingMode, setIsSettingMode ] = useState( false );

	// Makes sure the Sandbox is updated according to the Dark mode attribute.
	useEffect( () => {
		if ( isSettingMode ) {
			setIsSettingMode( false );
		}
	}, [ isSettingMode ] );

	const setMode = () => {
		setIsSettingMode( true );

		setAttributes( { useDarkMode: ! useDarkMode } );
	};

	const onSubmit = ( event ) => {
		if ( event ) {
			event.preventDefault();
		}

		setIsEditingURL( false );
		setAttributes( { url: value } );
	};

	const switchBackToURLInput = ( event ) => {
		if ( event ) {
			event.preventDefault();
		}

		setIsEditingURL( true );
	};

	const editToolbar = (
		<BlockControls>
			<ToolbarGroup>
				<ToolbarButton
					icon="edit"
					title={ __(
						'Edit Gist URL',
						'bout-de-code'
					) }
					onClick={ switchBackToURLInput }
				/>
			</ToolbarGroup>
		</BlockControls>
	);

	if ( isEditingURL ) {
		return (
			<div { ...blockProps }>
				<Placeholder
					icon={ IconBoutDeCode }
					label={ label }
					className="wp-block-embed"
					instructions={ __(
						'Paste the Gist.GitHub.com URL of the source code to embed into your post.',
						'bout-de-code'
					) }
				>
					<form onSubmit={ onSubmit }>
						<input
							type="url"
							value={ value || '' }
							className="components-placeholder__input"
							aria-label={ label }
							placeholder={ __(
								'Paste the Gist URL to embed…',
								'bout-de-code'
							) }
							onChange={ ( event ) => setURL( event.target.value ) }
						/>
						<Button variant="primary" type="submit">
							{ __( 'Embed', 'bout-de-code' ) }
						</Button>
					</form>
				</Placeholder>
			</div>
		);
	}

	if ( fetching || isSettingMode ) {
		return (
			<div { ...blockProps }>
				<div className="wp-block-embed is-loading">
					<Spinner />
				</div>
			</div>
		);
	}

	if (
		! preview ||
		! preview.url ||
		! preview.isBoutDeCode ||
		! preview.iframeStyle
	) {
		return (
			<div { ...blockProps }>
				{ editToolbar }
				<Placeholder icon={ IconBoutDeCode } label={ label }>
					<p className="components-placeholder__error">
						{ __(
							'The URL your provided is not about a code hosted on Gist.GitHub.com.',
							'bout-de-code'
						) }
					</p>
				</Placeholder>
			</div>
		);
	}

	const sidebarSettings = (
		<InspectorControls>
			<PanelBody
				title={ __( 'Settings', 'bout-de-code' ) }
				initialOpen={ true }
			>
				<ToggleControl
					__nextHasNoMarginBottom
					label={ __( 'Use dark mode', 'bout-de-code' ) }
					checked={ !! useDarkMode }
					onChange={ () => setMode() }
					help={
						useDarkMode
							? __( 'Dark mode on', 'bout-de-code' )
							: __( 'Switch to dark mode', 'bout-de-code' )
					}
				/>
			</PanelBody>
		</InspectorControls>
	);

	let classNames = 'wp-block-embed .wp-block-imath-bout-de-code';
	if ( useDarkMode ) {
		classNames += ' use-dark-mode';
	}

	return (
		<div { ...blockProps }>
			{ ! isEditingURL && editToolbar }
			{ ! isEditingURL && sidebarSettings }
			<figure className={ classNames }>
				<div className="wp-block-embed__wrapper">
					<SandBox
						type={ useDarkMode ? 'use-dark-mode' : '' }
						scripts={ [ preview.url ] }
						styles={ [ preview.iframeStyle ] }
					/>
				</div>
				{ ( ! RichText.isEmpty( caption ) || isSelected ) && (
					<RichText
						tagName="figcaption"
						placeholder={ __(
							'Write a caption…',
							'bout-de-code'
						) }
						value={ caption }
						onChange={ ( text ) =>
							setAttributes( { caption: text } )
						}
						inlineToolbar
					/>
				) }
			</figure>
		</div>
	);
};

const EditBoutDeCodeBlock = compose( [
	withSelect( ( select, ownProps ) => {
		const { url } = ownProps.attributes;
		const { getEmbedPreview, isRequestingEmbedPreview } = select( 'core' );
		const preview = !! url && getEmbedPreview( url );
		const fetching = !! url && isRequestingEmbedPreview( url );

		return { preview, fetching };
	} ),
] )( EditBoutDeCode );

export default EditBoutDeCodeBlock;
