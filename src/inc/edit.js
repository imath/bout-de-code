/**
 * WordPress dependencies.
 */
const {
	blockEditor: { InspectorControls, RichText, BlockControls },
	components: {
		Placeholder,
		PanelBody,
		ToggleControl,
		SandBox,
		Button,
		ExternalLink,
		Spinner,
		ToolbarGroup,
		ToolbarButton,
	},
	compose: { compose },
	data: { withSelect },
	element: {
		/* eslint-disable no-unused-vars */
		createElement,
		Fragment,
		useState,
		useEffect,
	},
	i18n: { __ },
} = wp;

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
	const { url, caption, useDarkMode } = attributes;
	const label = __( 'Bout de Code', 'bout-de-code' );
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
						'Modifier l’URL du Bout de Code',
						'bout-de-code'
					) }
					onClick={ switchBackToURLInput }
				/>
			</ToolbarGroup>
		</BlockControls>
	);

	if ( isEditingURL ) {
		return (
			<Placeholder
				icon={ IconBoutDeCode }
				label={ label }
				className="wp-block-embed"
				instructions={ __(
					'Collez l’URL du Gist que vous souhaitez embarquer dans votre publication.',
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
							'Saisissez l’URL à embarquer…',
							'bout-de-code'
						) }
						onChange={ ( event ) => setURL( event.target.value ) }
					/>
					<Button isPrimary type="submit">
						{ __( 'Embarquer', 'bout-de-code' ) }
					</Button>
				</form>
				<div className="components-placeholder__learn-more">
					<ExternalLink
						href={ __(
							'https://wordpress.org/support/article/embeds/'
						) }
					>
						{ __(
							'En apprendre plus à propos des contenus embarqués',
							'bout-de-code'
						) }
					</ExternalLink>
				</div>
			</Placeholder>
		);
	}

	if ( fetching || isSettingMode ) {
		return (
			<div className="wp-block-embed is-loading">
				<Spinner />
				<p>{ __( 'Chargement en cours…', 'bout-de-code' ) }</p>
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
			<Fragment>
				{ editToolbar }
				<Placeholder icon={ IconBoutDeCode } label={ label }>
					<p className="components-placeholder__error">
						{ __(
							'L’URL que vous avez fournie n’est pas celle d’un bout de code hébergé sur Gist.GitHub.com.',
							'bout-de-code'
						) }
					</p>
				</Placeholder>
			</Fragment>
		);
	}

	const sidebarSettings = (
		<InspectorControls>
			<PanelBody
				title={ __( 'Réglages', 'bout-de-code' ) }
				initialOpen={ true }
			>
				<ToggleControl
					label={ __( 'Utiliser le mode sombre', 'bout-de-code' ) }
					checked={ !! useDarkMode }
					onChange={ () => setMode() }
					help={
						useDarkMode
							? __( 'Mode sombre activé.', 'bout-de-code' )
							: __( 'Basculer en mode sombre.', 'bout-de-code' )
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
		<Fragment>
			{ ! isEditingURL && editToolbar && sidebarSettings }
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
							'Rédigez la légende…',
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
		</Fragment>
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
