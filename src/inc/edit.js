/**
 * WordPress dependencies.
 */
const {
	blockEditor: { RichText, BlockControls },
	components: {
		Placeholder,
		Disabled,
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
	const { url, caption } = attributes;
	const label = __( 'Bout de Code', 'bout-de-code' );
	const [ value, setURL ] = useState( url );
	const [ isEditingURL, setIsEditingURL ] = useState( ! url );

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

	if ( fetching ) {
		return (
			<div className="wp-block-embed is-loading">
				<Spinner />
				<p>{ __( 'Chargement en cours…', 'bout-de-code' ) }</p>
			</div>
		);
	}

	if ( ! preview || ! preview.url || ! preview.is_bout_de_code ) {
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

	return (
		<Fragment>
			{ ! isEditingURL && editToolbar }
			<figure className="wp-block-embed is-bout-de-code">
				<div className="wp-block-embed__wrapper">
					<Disabled>
						<SandBox scripts={ [ preview.url ] } />
					</Disabled>
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
