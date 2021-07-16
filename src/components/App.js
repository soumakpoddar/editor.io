import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Editor from './Editor';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={2}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    height: 350,
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
}));

function App(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const [html,setHtml] = useState('');
  const [css,setCss] = useState('');
  const [js,setJs] = useState('');
  const [srcDoc,setSrcDoc]=useState('');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(()=>{
    const timeout=setTimeout(()=>{
      setSrcDoc(`
      <html>
        <body>${html}</body>
        <style>${css}</style>
        <script>${js}</script>
      </html>
    `)
    },250)

    return ()=>clearTimeout(timeout)

  },[html,css,js])

  return (
    <>
      <div className={classes.root} id="top-pane">
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={value}
          onChange={handleChange}
          aria-label="File Explorer"
          className={classes.tabs}
        >
          <Tab label="index.html" {...a11yProps(0)} />
          <Tab label="index.css" {...a11yProps(1)} />
          <Tab label="index.js" {...a11yProps(2)} />
          <Tab label="Share" {...a11yProps(3)} />
        </Tabs>

        <TabPanel value={value} index={0} style={{width:"100%"}}>
          <Editor
            language="xml"
            displayName="HTML </>"
            value={html}
            onChange={setHtml}
          />
        </TabPanel>
        <TabPanel value={value} index={1} style={{width:"100%"}}>
          <Editor
            language="css"
            displayName="CSS </>"
            value={css}
            onChange={setCss}
          />
        </TabPanel>
        <TabPanel value={value} index={2} style={{width:"100%"}}>
          <Editor
            language="javascript"
            displayName="JS </>"
            value={js}
            onChange={setJs}
          />
        </TabPanel>
        <TabPanel value={value} index={3} style={{width:"100%"}}>
          
        </TabPanel>
      </div>

      <div className="pane">
        <iframe
          srcDoc={srcDoc}
          title="output"
          sandbox="allow-scripts"
          frameBorder="0"
          width="100%"
          height="100%"
        />
      </div>
    </>
  );
}

export default App;