<?php
/**
 * Plugin Name:         Enable Button Icons
 * Plugin URI:          https://www.nickdiego.com/
 * Description:         Easily add icons to Button blocks.
 * Version:             0.1.0
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
	/**
		* Enqueue Editor scripts and styles.
		*/
	function enable_button_icons_enqueue_block_editor_assets() {
		$asset_file = include plugin_dir_path(__FILE__) . 'build/index.asset.php';

		wp_enqueue_script(
			'enable-button-icons-editor-scripts',
			plugin_dir_url(__FILE__) . 'build/index.js',
			$asset_file['dependencies'],
			$asset_file['version']
		);

		// Pass icons data to JavaScript
		wp_localize_script(
			'enable-button-icons-editor-scripts',
			'enableButtonIconsData',
			array(
				'icons' => enable_button_icons_get_icons()
			)
		);

		wp_set_script_translations(
			'enable-button-icons-editor-scripts',
			'enable-button-icons',
			plugin_dir_path(__FILE__) . 'languages'
		);

		wp_enqueue_style(
			'enable-button-icons-editor-styles',
			plugin_dir_url(__FILE__) . 'build/editor.css'
		);
	}add_action( 'enqueue_block_editor_assets', 'enable_button_icons_enqueue_block_editor_assets' );

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

function enable_button_icons_get_icons() {
    $icons_dir = plugin_dir_path(__FILE__) . 'assets/icons/';
    $icons = array();
    
    if (is_dir($icons_dir)) {
        $files = glob($icons_dir . '*.svg');
        foreach ($files as $file) {
            $icon_name = basename($file, '.svg');
            $icons[$icon_name] = file_get_contents($file);
        }
    }
    
    return $icons;
}

function enable_button_icons_render_block_button($block_content, $block) {
    if (!isset($block['attrs']['icon'])) {
        return $block_content;
    }

    $icons = enable_button_icons_get_icons();
    $icon = $block['attrs']['icon'];
    $position_left = isset($block['attrs']['iconPositionLeft']) ? $block['attrs']['iconPositionLeft'] : false;
    
    if (!isset($icons[$icon])) {
        return $block_content;
    }

    // Add position class to the button
    $position_class = $position_left ? 'has-icon-left' : 'has-icon-right';
    
    // Find the anchor tag and insert the icon
    $pattern = '/<a(.*?)>(.*?)<\/a>/';
    $icon_html = $icons[$icon];
    
    return preg_replace_callback($pattern, function($matches) use ($icon_html, $position_class) {
        $anchor_attrs = $matches[1];
        $content = $matches[2];
        
        // Add position class to existing classes
        if (strpos($anchor_attrs, 'class="') !== false) {
            $anchor_attrs = preg_replace('/class="([^"]*)"/', 'class="$1 ' . $position_class . '"', $anchor_attrs);
        } else {
            $anchor_attrs .= ' class="' . $position_class . '"';
        }
        
        return '<a' . $anchor_attrs . '>' . 
               ($position_class === 'has-icon-left' ? $icon_html . $content : $content . $icon_html) . 
               '</a>';
    }, $block_content);
}

add_filter( 'render_block_core/button', 'enable_button_icons_render_block_button', 10, 2 );
