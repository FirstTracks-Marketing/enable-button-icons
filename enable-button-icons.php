<?php
/**
 * Plugin Name:         Enable Button Icons
 * Plugin URI:          https://www.nickdiego.com/
 * Description:         Easily add icons to Button blocks.
 * Version:             0.2.0
 * Requires at least:   6.3
 * Requires PHP:        7.4
 * Author:              Nick Diego
 * Author URI:          https://www.nickdiego.com
 * License:             GPLv2
 * License URI:         https://www.gnu.org/licenses/old-licenses/gpl-2.0.html
 * Text Domain:         enable-button-icons
 * Domain Path:         /languages
 *
 * @package enable-button-icons
 */

defined( 'ABSPATH' ) || exit;

/**
 * Enqueue Editor scripts and styles.
 */
function enable_button_icons_enqueue_block_editor_assets() {
	$asset_file = include plugin_dir_path( __FILE__ ) . 'build/index.asset.php';

	wp_enqueue_script(
		'enable-button-icons-editor-scripts',
		plugin_dir_url( __FILE__ ) . 'build/index.js',
		$asset_file['dependencies'],
		$asset_file['version']
	);

	wp_set_script_translations(
		'enable-button-icons-editor-scripts',
		'enable-button-icons',
		plugin_dir_path( __FILE__ ) . 'languages'
	);

	wp_enqueue_style(
		'enable-button-icons-editor-styles',
		plugin_dir_url( __FILE__ ) . 'build/editor.css'
	);
}
add_action( 'enqueue_block_editor_assets', 'enable_button_icons_enqueue_block_editor_assets' );

/**
 * Enqueue block styles
 * (Applies to both frontend and Editor)
 */
function enable_button_icons_block_styles() {
	wp_enqueue_block_style(
		'core/button',
		array(
			'handle' => 'enable-button-icons-block-styles',
			'src'    => plugin_dir_url( __FILE__ ) . 'build/style.css',
			'ver'    => wp_get_theme()->get( 'Version' ),
			'path'   => plugin_dir_path( __FILE__ ) . 'build/style.css',
		)
	);
}
add_action( 'init', 'enable_button_icons_block_styles' );

/**
 * Render icons on the frontend.
 */
function enable_button_icons_render_block_button( $block_content, $block ) {
	if ( ! isset( $block['attrs']['icon'] ) ) {
		return $block_content;
	}

	$icon         = $block['attrs']['icon'];
	$positionLeft = isset( $block['attrs']['iconPositionLeft'] ) ? $block['attrs']['iconPositionLeft'] : false; //phpcs:ignore

	// All available icon SVGs.
	$icons = array(
		'external-arrow'     => "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill-rule='evenodd' d='M20.383 3.076A.997.997 0 0 0 20 3h-5l-.117.007A1 1 0 0 0 14 4l.007.117A1 1 0 0 0 15 5h2.586l-8.293 8.293-.083.094a1 1 0 0 0 1.497 1.32L19 6.414V9l.007.117A1 1 0 0 0 21 9V4l-.007-.116M11 6a1 1 0 0 1 .117 1.993L11 8H6a1 1 0 0 0-.993.883L5 9v9a1 1 0 0 0 .883.993L6 19h9a1 1 0 0 0 .993-.883L16 18v-5a1 1 0 0 1 1.993-.117L18 13v5a3 3 0 0 1-2.824 2.995L15 21H6a3 3 0 0 1-2.995-2.824L3 18V9a3 3 0 0 1 2.824-2.995L6 6h5Z' clip-rule='evenodd'/></svg>",
		'play-circle'        => "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill-rule='evenodd' d='M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm0 2c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z' clip-rule='evenodd'/><path d='M9 9.003a1 1 0 0 1 1.513-.858l4.997 2.988a1.01 1.01 0 0 1 0 1.734l-4.997 2.988A1 1 0 0 1 9 14.997V9.003Z'/></svg>",
		'arrow-narrow-right' => "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill-rule='evenodd' d='m16.58 11.012-2.29-2.285v-.01a.987.987 0 0 1 0-1.418.992.992 0 0 1 1.42 0l4 3.992c.236.23.33.554.28.86a1 1 0 0 1-.39.656L15.7 16.7c-.19.18-.45.289-.71.289L15 17c-.27 0-.53-.11-.71-.29a.996.996 0 0 1-.01-1.417v-.01l2.28-2.275H5c-.56 0-1-.45-1-.998a.99.99 0 0 1 1-.998h11.58Z' clip-rule='evenodd'/></svg>",
		'arrow-narrow-left'  => "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill-rule='evenodd' d='M4.299 12.717a.996.996 0 0 1-.008-1.416v-.01L8.288 7.3a.99.99 0 0 1 1.42 0c.389.39.389 1.018 0 1.418l-2.3 2.295h11.593c.55 0 .999.44.999.998 0 .549-.45.998-1 .998H7.43l2.287 2.284a.993.993 0 0 1 0 1.408h-.01c-.19.18-.45.289-.71.289l.011.011c-.27 0-.53-.11-.709-.29l-3.997-3.992-.002-.001Z' clip-rule='evenodd'/></svg>",
		'search'             => "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill-rule='evenodd' d='M10 2a8 8 0 1 0 4.906 14.32l5.387 5.387.094.083a1 1 0 0 0 1.32-1.497l-5.387-5.387A8 8 0 0 0 10 2Zm0 2a6 6 0 1 1 0 12 6 6 0 0 1 0-12Z' clip-rule='evenodd'/></svg>",
		'globe'              => "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'><path fill-rule='evenodd' d='M14.146 10.834H17.5V9.167h-3.354c-.209-4.211-1.985-7.5-4.146-7.5-2.16 0-3.937 3.289-4.146 7.5H2.5v1.667h3.354c.209 4.21 1.985 7.5 4.146 7.5 2.16 0 3.937-3.29 4.146-7.5Zm-1.669 0c-.096 1.745-.489 3.248-1.021 4.314-.666 1.33-1.277 1.519-1.456 1.519-.18 0-.79-.189-1.456-1.52-.532-1.065-.925-2.568-1.021-4.313h4.954ZM7.523 9.167c.096-1.745.489-3.249 1.021-4.314.666-1.33 1.277-1.52 1.456-1.52.18 0 .79.19 1.456 1.52.532 1.065.925 2.569 1.021 4.314H7.523Z' clip-rule='evenodd'/><path fill-rule='evenodd' d='M10 16.667a6.667 6.667 0 1 0 0-13.333 6.667 6.667 0 0 0 0 13.333Zm0 1.667a8.333 8.333 0 1 0 0-16.667 8.333 8.333 0 0 0 0 16.667Z' clip-rule='evenodd'/></svg>",
		'language'           => "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'><path fill-rule='evenodd' d='M9.16 4.07a.833.833 0 0 0-1.66.096V5H4.166l-.097.005a.833.833 0 0 0 .097 1.661l3.299.001c-.12 1.422-.542 2.662-1.13 3.55-.323-.33-.503-.69-.502-1.05l-.005-.097a.833.833 0 0 0-1.662.095c-.001.837.36 1.593.985 2.226-.316.18-.647.275-.985.275l-.097.006a.834.834 0 0 0 .097 1.661c.896 0 1.721-.334 2.431-.919.804.405 1.763.692 2.809.83l-1.001 2.25-.034.092a.834.834 0 0 0 .457 1.008l.091.035a.834.834 0 0 0 1.01-.457l.52-1.172h4.102l.52 1.172.045.086a.833.833 0 0 0 1.479-.763l-3.334-7.5-.048-.094-.061-.089a.835.835 0 0 0-1.414.183l-1.62 3.647a7.914 7.914 0 0 1-2.374-.535l.049-.073c.74-1.167 1.222-2.69 1.343-4.367H10l.097-.006A.833.833 0 0 0 10 5h-.834v-.834l-.005-.097Zm3.34 6.314-1.31 2.949h2.621l-1.31-2.95Z' clip-rule='evenodd'/></svg>",
		'plus'               => "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill-rule='evenodd' d='M12.993 4.883A1 1 0 0 0 11 5v6H5l-.117.007A1 1 0 0 0 5 13h6v6l.007.117A1 1 0 0 0 13 19v-6h6l.117-.007A1 1 0 0 0 19 11h-6V5l-.007-.117Z' clip-rule='evenodd'/></svg>",
		'minus'              => "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><path fill-rule='evenodd' d='M25.334 14.667a1.333 1.333 0 0 1 .155 2.657l-.155.01H6.666a1.333 1.333 0 0 1-.156-2.658l.156-.01h18.666Z' clip-rule='evenodd'/></svg>",
		'download'           => "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill-rule='evenodd' d='M11.559 16.899a1.001 1.001 0 0 0 1.033-.094c.041-.03.081-.062.118-.097l5-5c.39-.4.39-1.03 0-1.42a.991.991 0 0 0-1.42 0l-3.29 3.3V4c0-.56-.45-1-1-1-.56 0-1 .44-1 1v9.586L7.71 10.29a.991.991 0 0 0-1.42 0 .99.99 0 0 0 0 1.42l5 5a.98.98 0 0 0 .269.19ZM21 19c0 1.65-1.35 3-3 3H6c-1.66 0-3-1.35-3-3v-2c0-.56.44-1 1-1 .55 0 1 .44 1 1v2c0 .55.44 1 1 1h12c.55 0 1-.45 1-1v-2c0-.56.44-1 1-1 .55 0 1 .44 1 1v2Z' clip-rule='evenodd'/></svg>",
		'multiply'           => "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 21 20'><path fill-rule='evenodd' d='M6.011 4.341a.833.833 0 0 0-1.1 1.248L9.321 10l-4.41 4.412-.07.078a.833.833 0 0 0 1.249 1.1l4.41-4.41 4.411 4.41.079.07a.833.833 0 0 0 1.1-1.248L11.679 10l4.41-4.41.07-.08a.833.833 0 0 0-1.248-1.1l-4.41 4.411-4.411-4.41-.079-.07Z' clip-rule='evenodd'/></svg>",

	);

	// Make sure the selected icon is in the array, otherwise bail.
	if ( ! array_key_exists( $icon, $icons ) ) {
		return $block_content;
	}

	// Append the icon class to the block.
	$p = new WP_HTML_Tag_Processor( $block_content );
	if ( $p->next_tag() ) {
		$p->add_class( 'has-icon__' . $icon );
	}
	$block_content = $p->get_updated_html();

	// Add the SVG icon either to the left of right of the button text.
	$block_content = $positionLeft //phpcs:ignore
		? preg_replace( '/(<a[^>]*>)(.*?)(<\/a>)/i', '$1<span class="wp-block-button__link-icon" aria-hidden="true">' . $icons[ $icon ] . '</span>$2$3', $block_content )
		: preg_replace( '/(<a[^>]*>)(.*?)(<\/a>)/i', '$1$2<span class="wp-block-button__link-icon" aria-hidden="true">' . $icons[ $icon ] . '</span>$3', $block_content );

	return $block_content;
}
add_filter( 'render_block_core/button', 'enable_button_icons_render_block_button', 10, 2 );
