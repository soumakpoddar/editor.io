import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import PasteClient from "pastebin-api";
import uuid from 'react-uuid';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
  const client = new PasteClient('g7ArbqAFdOrcJ32zdbvJ8NriUEYjzn4R');
  const [value, setValue] = React.useState(0);
  const [html,setHtml] = useState('');
  const [css,setCss] = useState('');
  const [js,setJs] = useState('');
  const [srcDoc,setSrcDoc]=useState('');
  const [hinp,setHinp]=useState('');
  const [cssinp,setCssinp]=useState('');
  const [jsinp,setJsinp]=useState('');
  const [click,setClick]=useState(false);

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

  },[html,css,js]);

  async function create(){

    const url1 = await client.createPaste({
      code: html,
      expireDate: "N",
      format: "html",
      name: uuid(),
      publicity: 0,
    });

    const url2 = await client.createPaste({
      code: css,
      expireDate: "N",
      format: "css",
      name: uuid(),
      publicity: 0,
    });

    const url3 = await client.createPaste({
      code: js,
      expireDate: "N",
      format: "javascript",
      name: uuid(),
      publicity: 0,
    });

    setHinp(url1);
    setCssinp(url2);
    setJsinp(url3);
  }

  function handleClick()
  {
    if(click===false)
    {
      setClick(true);
      create();
    }
    else
    {
      toast.warn('Link already generated. Copy it...✌️', {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        });
    }
  }

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
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
          <Button variant="contained" size="small" onClick={handleClick} style={{backgroundColor:"#40d11b"}}>
            Share Code
          </Button>

          <br/><br/>
          <div className="form">
            <label for="html">
              HTML Link :&nbsp;
            </label>
            <input type="text" className="html" value={hinp} />
            <br/><br/>
            
            <label for="css">
              CSS Link :&nbsp;
            </label>
            <input type="text" className="css" value={cssinp} />
            <br/><br/>
            
            <label for="js">
              JS Link :&nbsp;
            </label>
            <input type="text" className="js" value={jsinp} />
          </div>
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