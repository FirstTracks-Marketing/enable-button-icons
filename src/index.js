/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { addFilter } from '@wordpress/hooks';
import { InspectorControls } from '@wordpress/block-editor';
import {
	Button,
	PanelBody,
	PanelRow,
	ToggleControl,
	__experimentalGrid as Grid, // eslint-disable-line
} from '@wordpress/components';

/**
 * All available icons.
 * (Order determines presentation order)
 */
export const ICONS = [
	{
		label: __( 'External Arrow', 'enable-button-icons' ),
		value: 'external-arrow',
		icon: (
			<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'>
				<path fill-rule='evenodd' d='M20.383 3.076A.997.997 0 0 0 20 3h-5l-.117.007A1 1 0 0 0 14 4l.007.117A1 1 0 0 0 15 5h2.586l-8.293 8.293-.083.094a1 1 0 0 0 1.497 1.32L19 6.414V9l.007.117A1 1 0 0 0 21 9V4l-.007-.116M11 6a1 1 0 0 1 .117 1.993L11 8H6a1 1 0 0 0-.993.883L5 9v9a1 1 0 0 0 .883.993L6 19h9a1 1 0 0 0 .993-.883L16 18v-5a1 1 0 0 1 1.993-.117L18 13v5a3 3 0 0 1-2.824 2.995L15 21H6a3 3 0 0 1-2.995-2.824L3 18V9a3 3 0 0 1 2.824-2.995L6 6h5Z' clip-rule='evenodd'/>
			</svg>
		),
	},
	{
		label: __( 'Play Circle', 'enable-button-icons' ),
		value: 'play-circle',
		icon: (
			<svg
				width="24"
				height="24"
				viewBox="0 0 24 24"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path fill-rule='evenodd' d='M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm0 2c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z' clip-rule='evenodd'/><path d='M9 9.003a1 1 0 0 1 1.513-.858l4.997 2.988a1.01 1.01 0 0 1 0 1.734l-4.997 2.988A1 1 0 0 1 9 14.997V9.003Z'/>
			</svg>
		),
	},
	{
		label: __( 'Arrow Right', 'enable-button-icons' ),
		value: 'arrow-narrow-right',
		icon: (
			<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'>
  				<path fill-rule='evenodd' d='m16.58 11.012-2.29-2.285v-.01a.987.987 0 0 1 0-1.418.992.992 0 0 1 1.42 0l4 3.992c.236.23.33.554.28.86a1 1 0 0 1-.39.656L15.7 16.7c-.19.18-.45.289-.71.289L15 17c-.27 0-.53-.11-.71-.29a.996.996 0 0 1-.01-1.417v-.01l2.28-2.275H5c-.56 0-1-.45-1-.998a.99.99 0 0 1 1-.998h11.58Z' clip-rule='evenodd'/>
			</svg>
		),
	},
	{
		label: __( 'Arrow Left', 'enable-button-icons' ),
		value: 'arrow-narrow-left',
		icon: (
			<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'>
				<path fill-rule='evenodd' d='M4.299 12.717a.996.996 0 0 1-.008-1.416v-.01L8.288 7.3a.99.99 0 0 1 1.42 0c.389.39.389 1.018 0 1.418l-2.3 2.295h11.593c.55 0 .999.44.999.998 0 .549-.45.998-1 .998H7.43l2.287 2.284a.993.993 0 0 1 0 1.408h-.01c-.19.18-.45.289-.71.289l.011.011c-.27 0-.53-.11-.709-.29l-3.997-3.992-.002-.001Z' clip-rule='evenodd'/>
			</svg>
		),
	},
	// {
	// 	label: __( 'Search', 'enable-button-icons' ),
	// 	value: 'search',
	// 	icon: (
	// 		<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'>
	// 			<path fill-rule='evenodd' d='M10 2a8 8 0 1 0 4.906 14.32l5.387 5.387.094.083a1 1 0 0 0 1.32-1.497l-5.387-5.387A8 8 0 0 0 10 2Zm0 2a6 6 0 1 1 0 12 6 6 0 0 1 0-12Z' clip-rule='evenodd'/>
	// 		</svg>
	// 	),
	// },
	// {
	// 	label: __( 'Globe', 'enable-button-icons' ),
	// 	value: 'globe',
	// 	icon: (
	// 		<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'>
	// 			<path fill-rule='evenodd' d='M14.146 10.834H17.5V9.167h-3.354c-.209-4.211-1.985-7.5-4.146-7.5-2.16 0-3.937 3.289-4.146 7.5H2.5v1.667h3.354c.209 4.21 1.985 7.5 4.146 7.5 2.16 0 3.937-3.29 4.146-7.5Zm-1.669 0c-.096 1.745-.489 3.248-1.021 4.314-.666 1.33-1.277 1.519-1.456 1.519-.18 0-.79-.189-1.456-1.52-.532-1.065-.925-2.568-1.021-4.313h4.954ZM7.523 9.167c.096-1.745.489-3.249 1.021-4.314.666-1.33 1.277-1.52 1.456-1.52.18 0 .79.19 1.456 1.52.532 1.065.925 2.569 1.021 4.314H7.523Z' clip-rule='evenodd'/>
	// 			<path fill-rule='evenodd' d='M10 16.667a6.667 6.667 0 1 0 0-13.333 6.667 6.667 0 0 0 0 13.333Zm0 1.667a8.333 8.333 0 1 0 0-16.667 8.333 8.333 0 0 0 0 16.667Z' clip-rule='evenodd'/>
	// 		</svg>
	// 	),
	// },
	// {
	// 	label: __( 'Language', 'enable-button-icons' ),
	// 	value: 'language',
	// 	icon: (
	// 		<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'>
	// 			<path fill-rule='evenodd' d='M9.16 4.07a.833.833 0 0 0-1.66.096V5H4.166l-.097.005a.833.833 0 0 0 .097 1.661l3.299.001c-.12 1.422-.542 2.662-1.13 3.55-.323-.33-.503-.69-.502-1.05l-.005-.097a.833.833 0 0 0-1.662.095c-.001.837.36 1.593.985 2.226-.316.18-.647.275-.985.275l-.097.006a.834.834 0 0 0 .097 1.661c.896 0 1.721-.334 2.431-.919.804.405 1.763.692 2.809.83l-1.001 2.25-.034.092a.834.834 0 0 0 .457 1.008l.091.035a.834.834 0 0 0 1.01-.457l.52-1.172h4.102l.52 1.172.045.086a.833.833 0 0 0 1.479-.763l-3.334-7.5-.048-.094-.061-.089a.835.835 0 0 0-1.414.183l-1.62 3.647a7.914 7.914 0 0 1-2.374-.535l.049-.073c.74-1.167 1.222-2.69 1.343-4.367H10l.097-.006A.833.833 0 0 0 10 5h-.834v-.834l-.005-.097Zm3.34 6.314-1.31 2.949h2.621l-1.31-2.95Z' clip-rule='evenodd'/>
	// 		</svg>
	// 	),
	// },
	// {
	// 	label: __( 'Plus', 'enable-button-icons' ),
	// 	value: 'plus',
	// 	icon: (
	// 		<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'>
	// 			<path fill-rule='evenodd' d='M12.993 4.883A1 1 0 0 0 11 5v6H5l-.117.007A1 1 0 0 0 5 13h6v6l.007.117A1 1 0 0 0 13 19v-6h6l.117-.007A1 1 0 0 0 19 11h-6V5l-.007-.117Z' clip-rule='evenodd'/>
	// 		</svg>
	// 	),
	// },
	// {
	// 	label: __( 'Minus', 'enable-button-icons' ),
	// 	value: 'minus',
	// 	icon: (
	// 		<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'>
	// 			<path fill-rule='evenodd' d='M25.334 14.667a1.333 1.333 0 0 1 .155 2.657l-.155.01H6.666a1.333 1.333 0 0 1-.156-2.658l.156-.01h18.666Z' clip-rule='evenodd'/>
	// 		</svg>
	// 	),
	// },
	{
		label: __( 'Download', 'enable-button-icons' ),
		value: 'download',
		icon: (
			<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'><path fill-rule='evenodd' d='M11.559 16.899a1.001 1.001 0 0 0 1.033-.094c.041-.03.081-.062.118-.097l5-5c.39-.4.39-1.03 0-1.42a.991.991 0 0 0-1.42 0l-3.29 3.3V4c0-.56-.45-1-1-1-.56 0-1 .44-1 1v9.586L7.71 10.29a.991.991 0 0 0-1.42 0 .99.99 0 0 0 0 1.42l5 5a.98.98 0 0 0 .269.19ZM21 19c0 1.65-1.35 3-3 3H6c-1.66 0-3-1.35-3-3v-2c0-.56.44-1 1-1 .55 0 1 .44 1 1v2c0 .55.44 1 1 1h12c.55 0 1-.45 1-1v-2c0-.56.44-1 1-1 .55 0 1 .44 1 1v2Z' clip-rule='evenodd'/></svg>
		),
	},
	{
		label: __( 'Phone', 'enable-button-icons' ),
		value: 'phone',
		icon: (
			<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'><path d='M20.482 19.517 20 20c-1.49 1.49-7 2-12.5-3.5S2.5 5.5 4 4l.491-.491a1.75 1.75 0 0 1 2.693.267l2.02 3.03a1.75 1.75 0 0 1-.218 2.208l-1.049 1.049c-.268.267-.357.663-.183.999.32.612.984 1.675 2.246 2.938 1.262 1.262 2.325 1.927 2.938 2.245.336.175.731.085 1-.182l1.048-1.049a1.75 1.75 0 0 1 2.208-.218l3.02 2.013a1.76 1.76 0 0 1 .268 2.708Z'/></svg>
		),
	},
	{
		label: __( 'Email', 'enable-button-icons' ),
		value: 'email',
		icon: (
			<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'><path fill-rule='evenodd' d='M2.327 5.638C2 6.28 2 7.12 2 8.8v6.4c0 1.68 0 2.52.327 3.162a3 3 0 0 0 1.311 1.311C4.28 20 5.12 20 6.8 20h10.4c1.68 0 2.52 0 3.162-.327a3 3 0 0 0 1.311-1.311C22 17.72 22 16.88 22 15.2V8.8c0-1.68 0-2.52-.327-3.162a3 3 0 0 0-1.311-1.311C19.72 4 18.88 4 17.2 4H6.8c-1.68 0-2.52 0-3.162.327a3 3 0 0 0-1.311 1.311Zm5.239 2.537a1 1 0 0 0-1.132 1.65l3.869 2.654a3 3 0 0 0 3.394 0l3.869-2.654a1 1 0 0 0-1.132-1.65l-3.868 2.654a1 1 0 0 1-1.132 0L7.566 8.175Z' clip-rule='evenodd'/></svg>
		),
	},
	// {
	// 	label: __( 'Multiply', 'enable-button-icons' ),
	// 	value: 'multiply',
	// 	icon: (
	// 		<svg xmlns='http://www.w3.org/2000/svg' width='21' height='20' viewBox='0 0 21 20'>
	// 			<path fill-rule='evenodd' d='M6.011 4.341a.833.833 0 0 0-1.1 1.248L9.321 10l-4.41 4.412-.07.078a.833.833 0 0 0 1.249 1.1l4.41-4.41 4.411 4.41.079.07a.833.833 0 0 0 1.1-1.248L11.679 10l4.41-4.41.07-.08a.833.833 0 0 0-1.248-1.1l-4.41 4.411-4.411-4.41-.079-.07Z' clip-rule='evenodd'/>
	// 		</svg>
	// 	),
	// },
];

/**
 * Add the attributes needed for button icons.
 *
 * @since 0.1.0
 * @param {Object} settings
 */
function addAttributes( settings ) {
	if ( 'core/button' !== settings.name ) {
		return settings;
	}

	// Add the block visibility attributes.
	const iconAttributes = {
		icon: {
			type: 'string',
		},
		iconPositionLeft: {
			type: 'boolean',
			default: false,
		},
	};

	const newSettings = {
		...settings,
		attributes: {
			...settings.attributes,
			...iconAttributes,
		},
	};

	return newSettings;
}

addFilter(
	'blocks.registerBlockType',
	'enable-button-icons/add-attributes',
	addAttributes
);

/**
 * Filter the BlockEdit object and add icon inspector controls to button blocks.
 *
 * @since 0.1.0
 * @param {Object} BlockEdit
 */
function addInspectorControls( BlockEdit ) {
	return ( props ) => {
		if ( props.name !== 'core/button' ) {
			return <BlockEdit { ...props } />;
		}

		const { attributes, setAttributes } = props;
		const { icon: currentIcon, iconPositionLeft } = attributes;

		return (
			<>
				<BlockEdit { ...props } />
				<InspectorControls>
					<PanelBody
						title={ __( 'Icon settings', 'enable-button-icons' ) }
						className="button-icon-picker"
						initialOpen={ true }
					>
						<PanelRow>
							<Grid
								className="button-icon-picker__grid"
								columns="5"
								gap="0"
							>
								{ ICONS.map( ( icon, index ) => (
									<Button
										key={ index }
										label={ icon?.label }
										isPressed={ currentIcon === icon.value }
										className="button-icon-picker__button"
										onClick={ () =>
											setAttributes( {
												// Allow user to disable icons.
												icon:
													currentIcon === icon.value
														? null
														: icon.value,
											} )
										}
									>
										{ icon.icon ?? icon.value }
									</Button>
								) ) }
							</Grid>
						</PanelRow>
						<PanelRow>
							<ToggleControl
								label={ __(
									'Show icon on left',
									'enable-button-icons'
								) }
								checked={ iconPositionLeft }
								onChange={ () => {
									setAttributes( {
										iconPositionLeft: ! iconPositionLeft,
									} );
								} }
							/>
						</PanelRow>
					</PanelBody>
				</InspectorControls>
			</>
		);
	};
}

addFilter(
	'editor.BlockEdit',
	'enable-button-icons/add-inspector-controls',
	addInspectorControls
);

/**
 * Add icon and position classes in the Editor.
 *
 * @since 0.1.0
 * @param {Object} BlockListBlock
 */
function addClasses( BlockListBlock ) {
	return ( props ) => {
		const { name, attributes } = props;

		if ( 'core/button' !== name || ! attributes?.icon ) {
			return <BlockListBlock { ...props } />;
		}

		const classes = classnames( props?.className, {
			[ `has-icon__${ attributes?.icon }` ]: attributes?.icon,
			'has-icon-position__left': attributes?.iconPositionLeft,
		} );

		return <BlockListBlock { ...props } className={ classes } />;
	};
}

addFilter(
	'editor.BlockListBlock',
	'enable-button-icons/add-classes',
	addClasses
);
