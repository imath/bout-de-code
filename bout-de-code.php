<?php
/**
 * A Retraceur Block to embed Gists in posts.
 *
 * @package   Bout de code
 * @author    imath
 * @license   GPL-2.0+
 * @link      https://imathi.eu
 *
 * @retraceur-block
 * Plugin Name:        Bout de code
 * Plugin URI:         https://github.com/imath/bout-de-code
 * Plugin Type:        block
 * Description:        Embed your Gists from Gist.GitHub.com into your Retraceur posts.
 * Version:            1.1.0
 * Author:             imath
 * Author URI:         https://imathi.eu
 * Requires Retraceur: 1.0.0
 * Up to Retraceur:    2.0.0-alpha
 * Requires PHP:       5.6
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
