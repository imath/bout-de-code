<?php
/**
 * A Retraceur Block to embed Gists in posts.
 *
 * @package   Bout de code
 * @author    imath
 * @license   MIT
 * @link      https://imathi.eu
 *
 * @retraceur-block
 * Plugin Name:        Bout de code
 * Plugin URI:         https://github.com/imath/bout-de-code
 * Plugin Type:        block
 * Description:        Embed your Gists from Gist.GitHub.com into your Retraceur posts.
 * Version:            1.2.0
 * Author:             imath
 * Author URI:         https://imathi.eu
 * Requires Retraceur: 3.2.0
 * Up to Retraceur:    4.0.0
 * Requires PHP:       7.4
 * Text Domain:        bout-de-code
 * License:            MIT License
 * License URI:        https://github.com/imath/bout-de-code/blob/trunk/LICENSE.md
 * Domain Path:        /languages/
 * GitHub Plugin URI:  https://github.com/imath/bout-de-code
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Register the Bout de code Block.
 *
 * @since 1.0.0
 */
function bout_de_code_block_init() {
	register_block_type( dirname( __FILE__ ) . '/build' );
}
add_action( 'init', 'bout_de_code_block_init' );

/**
 * Returns the Gist.GitHub.com embed provider.
 *
 * @since  1.0.0
 *
 * @return array The Gist.GitHub.com provider.
 */
function bout_de_code_get_embed_provider() {
	return apply_filters(
		'bout_de_code_embed_provider',
		array(
			'regex'    => '#(https://gist.github.com/(.*?)/([a-zA-Z0-9]+)?)(\#file(\-|_)(.+))?$#i',
			'callback' => 'bout_de_code_gist_handler',
			'format'   => '#https?://gist\.github\.com/.*#i',
			'provider' => 'https://gist.github.com',
			'validate' => 'bout_de_code_build_gist_src',
		)
	);
}

/**
 * Register the Gist.GitHub.com embed provider.
 *
 * @since  1.0.0
 */
function bout_de_code_register_embed_provider() {
	$bout_de_code = bout_de_code_get_embed_provider();

	// This is needed to fetch the Gist into the Block Editor.
	wp_oembed_add_provider( $bout_de_code['format'], $bout_de_code['provider'], true );

	// This is needed for the classic editor and on front-end.
	wp_embed_register_handler( 'bout_de_code_gist', $bout_de_code['regex'], $bout_de_code['callback'] );
}
add_action( 'plugins_loaded', 'bout_de_code_register_embed_provider', 30 );

/**
 * Customize the oembed url for Bout de code.
 *
 * @since  1.0.0
 *
 * @param  string $provider The URL provider.
 * @param  string $url      The URL to embed.
 * @return string The URL to request.
 */
function bout_de_code_oembed_fetch_url( $provider = '', $url = '' ) {
	$provider_data = wp_parse_url( $provider );

	if ( ! isset( $provider_data['host'] ) || 'gist.github.com' !== $provider_data['host'] ) {
		return $provider;
	}

	// It's a Gist, make sure the reply will be a JSON content.
	add_filter( 'http_response', 'bout_de_code_embed_response', 10, 3 );

	return $url;
}
add_filter( 'oembed_fetch_url', 'bout_de_code_oembed_fetch_url', 10, 2 );

/**
 * Edit the JSON reply for the embed Gist.
 *
 * @since  1.0.0
 *
 * @param  array  $response The HTTP request response.
 * @param  array  $args     The HTTP request arguments.
 * @param  string $url      The requested URL.
 * @return array            The HTTP request response.
 */
function bout_de_code_embed_response( $response, $args, $url ) {
	remove_filter( 'http_response', 'bout_de_code_embed_response', 10, 3 );

	$handler = bout_de_code_get_embed_provider();

	if ( ! isset( $handler['regex'] ) || ! isset( $handler['validate'] ) ) {
		return $response;
	}

	$body    = '';
	$raw_url = str_replace( '?', '', remove_query_arg( array( 'format' ), $url ) );

	if ( ! preg_match( $handler['regex'], $raw_url, $matches ) || ! function_exists( $handler['validate'] ) ) {
		return $response;
	}

	$url = call_user_func_array( $handler['validate'], array( $matches ) );

	if ( ! $url ) {
		return $response;
	}

	$response['body'] = wp_json_encode(
		array(
			'url'          => $url,
			'isBoutDeCode' => true,
			'iframeStyle'  => str_replace(
				'.wp-block-imath-bout-de-code.use-dark-mode',
				'html.use-dark-mode body',
				file_get_contents( trailingslashit( plugin_dir_path( __FILE__ ) ) . 'build/index.css' )
			),
		)
	);

	$response['http_response']->set_data( $response['body'] );

	return $response;
}

/**
 * Builds the src attribute of the Bout de code to embed.
 *
 * @since 1.0.0
 *
 * @param  array $matches Results of the URL regex.
 * @return string The `src` attribute of the Bout de code to embed.
 */
function bout_de_code_build_gist_src( $matches = array() ) {
	$src = '';

	if ( isset( $matches[3] ) ) {
		$src = $matches[1] . '.js';

		if ( isset( $matches[6] ) ) {
			$src = add_query_arg( 'file', preg_replace( '/[\-\.]([a-z]+)$/', '.\1', $matches[6] ), $src );
		}
	}

	return $src;
}

/**
 * Bout de code embed handler callback.
 *
 * @since 1.0.0
 *
 * @param array  $matches The RegEx matches from the provided regex when calling
 *                        wp_embed_register_handler().
 * @param array  $attr    Embed attributes.
 * @param string $url     The original URL that was matched by the regex.
 * @return string The embed HTML.
 */
function bout_de_code_gist_handler( $matches, $attr, $url ) {
	$retval = '';

	$src = bout_de_code_build_gist_src( $matches );

	if ( $url ) {
		$retval = sprintf( '<script src="%s"></script>', esc_url( $src ) );
	}

	return $retval;
}
