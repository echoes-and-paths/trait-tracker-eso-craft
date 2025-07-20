import React from 'react';
import { APP_COMMIT, APP_BUILD_TIME } from '../version';

const shortCommit = (APP_COMMIT || 'unknown').slice(0, 7);
const buildDate = new Date(APP_BUILD_TIME).toLocaleDateString();

const badgeStyle: React.CSSProperties = {
  position: 'fixed',
  bottom: '6px',
  right: '6px',
  fontSize: '11px',
  fontFamily: 'monospace',
  background: 'rgba(0,0,0,0.55)',
  color: '#fff',
  padding: '4px 6px',
  borderRadius: '6px',
  backdropFilter: 'blur(4px)',
  zIndex: 9999,
  lineHeight: 1.3,
};

const VersionBadge: React.FC = () => (
  <div style={badgeStyle} title={`Commit: ${APP_COMMIT}\nBuilt: ${APP_BUILD_TIME}`}>
    v:{shortCommit}<br />{buildDate}
  </div>
);

export default VersionBadge;
