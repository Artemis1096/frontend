// In frontend/src/components/AuctionCard.jsx

import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { format, differenceInHours, differenceInMinutes } from 'date-fns';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import GavelIcon from '@mui/icons-material/Gavel';
import Badge from './Badge';

const AuctionCard = ({ auction }) => {
  // Calculate time left
  const endTime = new Date(auction.endTime);
  const now = new Date();
  const hoursLeft = differenceInHours(endTime, now);
  const minutesLeft = differenceInMinutes(endTime, now);
  const isEndingSoon = hoursLeft < 24 && hoursLeft >= 0;
  const isEnded = endTime < now;
  const isNew = differenceInHours(now, new Date(auction.createdAt)) < 24;

  // Format time left display
  const getTimeLeft = () => {
    if (isEnded) return 'Ended';
    if (hoursLeft < 1) return `${minutesLeft}m left`;
    if (hoursLeft < 24) return `${hoursLeft}h left`;
    const daysLeft = Math.floor(hoursLeft / 24);
    return `${daysLeft}d left`;
  };

  const formattedEndTime = format(endTime, "MMM d, yyyy 'at' h:mm a");

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 12px 32px rgba(99, 102, 241, 0.2)',
        },
      }}
    >
      {/* Badges */}
      <Box
        sx={{
          position: 'absolute',
          top: 12,
          left: 12,
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
        }}
      >
        {isNew && !isEnded && (
          <Badge label="New" type="new" className="pulse-badge" />
        )}
        {isEndingSoon && !isEnded && (
          <Badge label="Ending Soon" type="ending-soon" className="pulse-badge" />
        )}
        {isEnded && <Badge label="Ended" type="ended" />}
      </Box>

      {/* Image */}
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          height: 240,
          backgroundColor: '#f0f0f0',
        }}
      >
        <CardMedia
          component="img"
          image={auction.imageUrl}
          alt={auction.title}
          sx={{
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s ease',
            '&:hover': {
              transform: 'scale(1.05)',
            },
          }}
        />
        {/* Time Badge Overlay */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 12,
            right: 12,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            borderRadius: 2,
            px: 1.5,
            py: 0.5,
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
          }}
        >
          <AccessTimeIcon sx={{ fontSize: 16 }} />
          <Typography variant="caption" fontWeight={600}>
            {getTimeLeft()}
          </Typography>
        </Box>
      </Box>

      {/* Content */}
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 2.5 }}>
        <Typography
          variant="h6"
          component="h2"
          sx={{
            fontWeight: 600,
            mb: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            minHeight: '3.5em',
          }}
        >
          {auction.title}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            flexGrow: 1,
          }}
        >
          {auction.description}
        </Typography>

        {/* Price Section */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            mb: 2,
            pb: 2,
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
              Current Bid
            </Typography>
            <Typography
              variant="h5"
              color="primary"
              sx={{
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
              }}
            >
              <GavelIcon sx={{ fontSize: 20 }} />
              ${auction.currentPrice.toFixed(2)}
            </Typography>
          </Box>
        </Box>

        {/* Footer */}
        <Box sx={{ mt: 'auto' }}>
          <Button
            component={RouterLink}
            to={`/auction/${auction._id}`}
            variant="contained"
            fullWidth
            size="large"
            sx={{
              borderRadius: 2,
              py: 1.25,
              fontWeight: 600,
              textTransform: 'none',
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(99, 102, 241, 0.4)',
              },
            }}
          >
            {isEnded ? 'View Details' : 'View & Bid'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AuctionCard;