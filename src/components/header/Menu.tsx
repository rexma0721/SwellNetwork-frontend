import { FC, MouseEvent, useState } from 'react';
import { MoreHorizontal } from 'react-feather';
import { useNavigate } from 'react-router-dom';

import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

const options = [{ label: 'Node Operators', link: '/node-operators' }];

const ITEM_HEIGHT = 48;

const MoreMenu: FC = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        aria-label="more"
        id="long-button"
        onClick={handleClick}
        sx={{
          background: '#fff',
          width: {
            xs: 30,
            lg: 40,
          },
          padding: 0,
          height: {
            xs: 30,
            lg: 36,
          },
          borderRadius: '9px',
        }}
      >
        <MoreHorizontal />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        id="long-menu"
        MenuListProps={{
          'aria-labelledby': 'long-button',
        }}
        onClose={handleClose}
        open={open}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: 'fit-content',
            marginTop: 2,
          },
        }}
        sx={{
          '& ul': {
            margin: 0,
            padding: 0,
          },
          '& .MuiPaper-root': {
            boxShadow: '0 0 8px 0 rgba(0,0,0,0.11)',
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      >
        {options.map((option) => (
          <MenuItem
            key={option.label}
            onClick={() => {
              setAnchorEl(null);
              navigate(option.link);
            }}
            sx={{ fontWeight: 'bold', padding: '8px 17px' }}
          >
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default MoreMenu;
