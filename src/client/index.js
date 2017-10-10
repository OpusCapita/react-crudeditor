import React from 'react';
import ReactDOM from 'react-dom';
import AppRouter from './routes';
import '../../styles/main.scss';
import './global-styles.less';

import {
  Menu,
  MenuIcon,
  MenuDropdownGrid,
  Notifications,
  Notification,
  MenuAccount,
  MenuSelect
} from '@opuscapita/react-navigation';

function requireAll(requireContext) {
  return requireContext.keys().map(key => ({
    name: key.replace(/(\.svg$|^\.\/)/gi, ''),
    svg: requireContext(key)
  }));
}

let icons = requireAll(require.context('!!raw-loader!@opuscapita/svg-icons/lib', true, /.*\.svg$/));

let getIcon = (name) => {
  return icons.filter(icon => icon.name === name)[0].svg;
}


let NavigationElement = (
  <Menu
    appName="Supplier Information Manager"
    activeItem={0}
    className="oc-menu--opuscapita-dark-theme"
    logoSrc={'https://develop.businessnetwork.opuscapita.com/invoice/static/img/oc-logo-white.svg'}
    logoTitle="OpusCapita"
    logoHref="http://opuscapita.com"
    labelText="powered by "
    labelLinkText="OpusCapita"
    labelLinkHref="http://opuscapita.com"
    showSearch={true}
    navigationItems={[
      { children: 'Dashboard', href: 'http://opuscapita.com' },
      { children: 'Supplier Application', href: 'http://opuscapita.com' },
      {
        children: 'Responsibilities',
        subItems: [
          {
            children: 'Supplier Responsibility Editor',
            href: 'http://opuscapita.com'
          },
          {
            children: 'Classification Group Responsibility Editor',
            href: 'http://opuscapita.com'
          }
        ]
      },
      {
        children: 'Reports',
        subItems: [
          {
            children: 'Supplier Status Report',
            href: 'http://opuscapita.com'
          },
          {
            children: 'Supplier Feedback',
            href: 'http://opuscapita.com'
          },
          {
            children: 'Supplier Rating',
            href: 'http://opuscapita.com'
          },
          {
            children: (<strong>Custom Child</strong>),
            href: 'http://opuscapita.com'
          }
        ]
      },
      { children: 'Contracts', href: '/crud/contracts' }
    ]}
    iconsBarItems={[
      (
        <MenuIcon
          key={'menu-icon-1'}
          onClick={() => console.log('click!')}
          svg={getIcon('shopping_cart')}
          supTitle="42"
          title="My cart"
        />
      ), (
        <MenuIcon
          key={'menu-icon-2'}
          onClick={() => console.log('click!')}
          svg={getIcon('list')}
          title="My lists"
        />
      ), (
        <MenuIcon
          key={'menu-icon-3'}
          onClick={() => console.log('click!')}
          svg={getIcon('apps')}
          title="Applications"
          hideDropdownArrow={true}
        >
          <MenuDropdownGrid
            activeItem={0}
            items={[
              {
                label: 'Online Product Catalog',
                svg: getIcon('local_mall')
              },
              {
                label: 'Request for Quote',
                svg: getIcon('monetization_on')
              },
              {
                label: 'Request',
                svg: getIcon('room_service')
              },
              {
                label: 'Order manager',
                svg: getIcon('insert_drive_file')
              },
              {
                label: 'Invoices manager',
                svg: getIcon('receipt')
              },
              {
                label: 'Analyze',
                svg: getIcon('trending_up')
              }
            ]}
          />
        </MenuIcon>
      ), (
        <MenuIcon
          key={'menu-icon-4'}
          onClick={() => console.log('click!')}
          svg={getIcon('notifications')}
          supTitle="10"
          title="Notifications"
          hideDropdownArrow={true}
        >
          <Notifications>
            <div className="oc-notifications__header">New notifications</div>
            <Notification
              svg={getIcon('info')}
              svgClassName="fill-info"
              message={<span>Your password will expire in 14 days. <a href="#">Change it now</a></span>}
              dateTime="20/02/2017"
            />
            <Notification
              svg={getIcon('warning')}
              svgClassName="fill-error"
              message={<span>Automatic currnency rate update failed. <a href="#">Try manual update</a></span>}
              dateTime="20/02/2017"
            />
            <hr className="oc-notifications__divider" />
            <div className="oc-notifications__header">Recent notifications</div>
            <Notification
              svg={getIcon('check')}
              svgClassName="fill-success"
              message={
                <span>
                  Full report for Neon Lights Oy you requester is ready. <a href="#">See full results</a>
                </span>
              }
              dateTime="20/02/2017"
            />
            <Notification
              svg={getIcon('info')}
              svgClassName="fill-info"
              message="You are substituting Steven Brice for invoice reviewing between 18.9.2017 - 29.9.2017"
              dateTime="20/02/2017"
            />
            <Notification
              svg={getIcon('notifications_active')}
              svgClassName="fill-warning"
              message={
                <span>
                  Your 5 invoices are highlighted as urgent for approval <a href="#">Show me those</a>
                </span>
              }
              dateTime="20/02/2017"
            />
            <div className="oc-notifications__more-container">
              <a href="#" className="oc-notifications__more">
                View more
              </a>
            </div>
          </Notifications>
        </MenuIcon>
      ),
      (
        <MenuIcon
          key={'menu-icon-5'}
          onClick={() => console.log('click!')}
          title="Account settings"
          label="Alexey"
        >
          <MenuAccount
            firstName="Alexey"
            lastName="Sergeev"
            userName="alexey.sergeev"
            initials="SA"
            avatarSrc="https://avatars0.githubusercontent.com/u/24603787?v=4&s=400"
            onClick={() => console.log('click')}
            onLogout={() => console.log('logout')}
            actions={[
              {
                label: 'My services',
                onClick: () => console.log('My services click')
              },
              {
                label: 'Settings',
                onClick: () => console.log('Settings click')
              },
              {
                label: 'Help',
                onClick: () => console.log('Help click')
              },
              {
                label: 'Log out',
                onClick: () => console.log('Log out click')
              }
            ]}
            bottomElement={(
              <div>
                <div className="oc-menu-account__select-item">
                  <span className="oc-menu-account__select-item-label">Current assignment</span>
                  <span>Masterkunden AG</span>
                </div>

                <div className="oc-menu-account__select-item">
                  <span className="oc-menu-account__select-item-label">Buying behalf on</span>

                  <MenuSelect
                    className="oc-menu-account__select-item-select"
                    onChange={e => console.log('change', e)}
                  >
                    <option>Cersei Lannister</option>
                    <option>Jaime Lannister</option>
                    <option>Jorah Mormont</option>
                    <option>Iron bank</option>
                    <option>Margaery Tyrell</option>
                    <option>Petyr Baelish</option>
                    <option>Robert Baratheon</option>
                  </MenuSelect>
                </div>

                <div className="oc-menu-account__select-item">
                  <span className="oc-menu-account__select-item-label">Language</span>

                  <MenuSelect
                    className="oc-menu-account__select-item-select"
                    onChange={e => console.log('change', e)}
                  >
                    <option>English</option>
                    <option>Finnish</option>
                    <option>German</option>
                    <option>Norwegian</option>
                    <option>Russian</option>
                    <option>Swedish</option>
                  </MenuSelect>
                </div>
              </div>
            )}
          />
        </MenuIcon>
      )
    ]}
  />
);

const renderCrudEditor = Component =>
  ReactDOM.render(
    <Component />,
    document.getElementById('app')
  );

const renderNavigation = () =>
  ReactDOM.render(
    NavigationElement,
    document.getElementById('navigation')
  );

renderCrudEditor(AppRouter);
renderNavigation();
