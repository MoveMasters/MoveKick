import React from 'react';
import AppBar from 'material-ui/AppBar';

/**
 * A simple example of `AppBar` with an icon on the right.
 * By default, the left icon is a navigation-menu.
 */
const NavigationBar = () => (
  <AppBar
    title="Title"
    iconClassNameRight="muidocs-icon-navigation-expand-more"
    style={{marginBottom: '15px'}}
  />
);

export default NavigationBar;