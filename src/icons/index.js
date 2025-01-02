import { Path, SVG } from '@wordpress/primitives';

// Import all SVG files from assets/icons
const iconContext = require.context('../../assets/icons', false, /\.svg$/);

// Create icons object
const icons = {};

iconContext.keys().forEach((key) => {
    const iconName = key.substring(2, key.lastIndexOf('.'));
    const IconComponent = () => (
        <SVG viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <Path d={iconContext(key).default} />
        </SVG>
    );
    icons[iconName] = IconComponent;
});

export default icons;
