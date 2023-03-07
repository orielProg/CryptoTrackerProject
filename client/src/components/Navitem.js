import { ListItem,Grid,Button,Link } from "@mui/material";
import { Paper } from "@mui/material";


const Navitem = props =>{
    const active = false;
    return (<Paper
        sx={{
          margin: 3,
          backgroundColor: "#1a212f",
          position: "relative",
        }}
      ><ListItem
        disableGutters
        sx={{
          display: 'flex',
          mb: 0.5,
          py: 0,
          px: 2
        }}
        
      >
        <Link
          href={props.href}
        >
          <Button
            component="a"
            startIcon={props.icon}
            disableRipple
            sx={{
              backgroundColor: active && 'rgba(255,255,255, 0.08)',
              borderRadius: 1,
              color: active ? 'secondary.main' : 'neutral.300',
              fontWeight: active && 'fontWeightBold',
              justifyContent: 'flex-start',
              px: 3,
              textAlign: 'left',
              textTransform: 'none',
              width: '100%',
              '& .MuiButton-startIcon': {
                color: active ? 'secondary.main' : 'neutral.400'
              },
              '&:hover': {
                backgroundColor: 'rgba(255,255,255, 0.08)'
              }
            }}
          >
            <Grid item>
              {props.title}
            </Grid>
          </Button>
        </Link>
      </ListItem>
      </Paper>
      
        );
};

export default Navitem;