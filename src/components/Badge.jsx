// Reusable Badge component for auction status indicators

import React from 'react';
import { Chip } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledBadge = styled(Chip)(({ theme, badgeType }) => {
  const getBadgeStyles = (type) => {
    switch (type) {
      case 'ending-soon':
        return {
          backgroundColor: theme.palette.error.main,
          color: '#ffffff',
          fontWeight: 600,
          animation: 'pulse 2s ease-in-out infinite',
        };
      case 'new':
        return {
          backgroundColor: theme.palette.success.main,
          color: '#ffffff',
          fontWeight: 600,
        };
      case 'highest-bidder':
        return {
          backgroundColor: theme.palette.warning.main,
          color: '#ffffff',
          fontWeight: 600,
        };
      case 'ended':
        return {
          backgroundColor: theme.palette.grey[600],
          color: '#ffffff',
          fontWeight: 600,
        };
      default:
        return {
          backgroundColor: theme.palette.primary.main,
          color: '#ffffff',
          fontWeight: 600,
        };
    }
  };

  return {
    ...getBadgeStyles(badgeType),
    fontSize: '0.75rem',
    height: '24px',
    '& .MuiChip-label': {
      padding: '0 8px',
    },
  };
});

const Badge = ({ label, type = 'default', className }) => {
  return (
    <StyledBadge
      label={label}
      badgeType={type}
      className={className}
      size="small"
    />
  );
};

export default Badge;

