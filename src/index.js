/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { Fragment } from '@wordpress/element';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl, ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

// Get icons from PHP
const { icons } = window.enableButtonIconsData;

// Create a preview component for the icon selector
const IconPreview = ({ iconKey }) => {
	if (!icons[iconKey]) return null;
	
	return (
		<div 
			className="button-icon-preview"
			dangerouslySetInnerHTML={{ __html: icons[iconKey] }}
		/>
	);
};

// Extend the SelectControl options to include previews
const iconOptions = Object.keys(icons).map(key => ({
	label: (
		<Fragment>
			<IconPreview iconKey={key} />
			<span>{key.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
		</Fragment>
	),
	value: key
}));

// Add position control
const withIconControls = createHigherOrderComponent(BlockEdit => {
    return props => {
        if (props.name !== 'core/button') {
            return <BlockEdit {...props} />;
        }

        const { attributes, setAttributes } = props;

        return (
            <Fragment>
                <BlockEdit {...props} />
                <InspectorControls>
                    <PanelBody title={__('Icon Settings', 'enable-button-icons')}>
                        <IconGrid 
                            selectedIcon={attributes.icon || ''}
                            onChange={icon => setAttributes({ icon })}
                        />
                        {attributes.icon && (
                            <ToggleControl
                                label={__('Icon on left', 'enable-button-icons')}
                                checked={!!attributes.iconPositionLeft}
                                onChange={() => setAttributes({ 
                                    iconPositionLeft: !attributes.iconPositionLeft 
                                })}
                            />
                        )}
                    </PanelBody>
                </InspectorControls>
            </Fragment>
        );
    };
}, 'withIconControls');


import { Button, Flex, FlexItem } from '@wordpress/components';

const IconGrid = ({ selectedIcon, onChange }) => {
    return (
        <Flex gap={2} justify="flex-start" wrap>
            {Object.keys(icons).map(iconKey => (
                <FlexItem key={iconKey}>
                    <Button
                        className={`icon-grid-button ${selectedIcon === iconKey ? 'is-selected' : ''}`}
                        onClick={() => onChange(iconKey)}
                        label={iconKey.replace(/-/g, ' ')}
                    >
                        <div 
                            className="icon-grid-preview"
                            dangerouslySetInnerHTML={{ __html: icons[iconKey] }}
                        />
                    </Button>
                </FlexItem>
            ))}
        </Flex>
    );
};

addFilter(
	'editor.BlockEdit',
	'enable-button-icons/with-icon-controls',
	withIconControls
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

addFilter(
    'blocks.registerBlockType',
    'enable-button-icons/button-attributes',
    (settings, name) => {
        if (name !== 'core/button') {
            return settings;
        }

        return {
            ...settings,
            attributes: {
                ...settings.attributes,
                icon: {
                    type: 'string',
                    default: ''
                },
                iconPositionLeft: {
                    type: 'boolean',
                    default: false
                }
            }
        };
    }
);

// Add save handler to ensure icons persist
addFilter(
    'blocks.getSaveContent.extraProps',
    'enable-button-icons/save-props',
    (extraProps, blockType, attributes) => {
        if (blockType.name !== 'core/button') {
            return extraProps;
        }

        if (attributes.icon) {
            extraProps.className = extraProps.className || '';
            extraProps.className += attributes.iconPositionLeft ? ' has-icon-left' : ' has-icon-right';
        }

        return extraProps;
    }
);

// Add edit handler for live preview
const withIconPreview = createHigherOrderComponent((BlockEdit) => {
    return (props) => {
        if (props.name !== 'core/button') {
            return <BlockEdit {...props} />;
        }

        const { attributes } = props;
        const { icon, iconPositionLeft } = attributes;

        if (!icon) {
            return <BlockEdit {...props} />;
        }

        const iconElement = (
            <span 
                className="button-icon"
                dangerouslySetInnerHTML={{ __html: icons[icon] }}
            />
        );

        return (
            <div className="wp-block-button">
                <div className={`wp-block-button__link ${iconPositionLeft ? 'has-icon-left' : 'has-icon-right'}`}>
                    {iconPositionLeft && iconElement}
                    <BlockEdit {...props} />
                    {!iconPositionLeft && iconElement}
                </div>
            </div>
        );
    };
}, 'withIconPreview');




addFilter(
    'editor.BlockEdit',
    'enable-button-icons/with-icon-preview',
    withIconPreview
);

import { registerBlockType } from '@wordpress/blocks';

// Register the extended button block
const buttonBlockType = wp.blocks.getBlockType('core/button');

if (buttonBlockType) {
    registerBlockType('core/button', {
        ...buttonBlockType,
        edit: withIconPreview(buttonBlockType.edit),
        save: (props) => {
            const { attributes } = props;
            const { icon, iconPositionLeft } = attributes;
            
            // Use the original save function
            const originalContent = buttonBlockType.save(props);
            
            if (!icon) {
                return originalContent;
            }

            // Add icon classes
            const className = `wp-block-button__link ${iconPositionLeft ? 'has-icon-left' : 'has-icon-right'}`;
            
            return cloneElement(originalContent, {
                className
            });
        }
    });
}
