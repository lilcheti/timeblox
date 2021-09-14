import './App.css';
import React, { useState, useEffect } from 'react';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import { Card, CardContent, Typography } from "@material-ui/core";
import MediaQuery from "react-responsive";
import { randomColor } from "randomcolor";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import axios from 'axios';
import Slider from '@material-ui/core/Slider';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Grid from '@material-ui/core/Grid';
import { Modal } from "@material-ui/core";

var days = ["yeshanbe", "doshanbe", "seshanbe", "charshanbe", "panshanbe", "jome", "shanbe"];
var selectedDay = new Date();
const addcontext = React.createContext();

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 300,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  Task: {
    marginTop: "10px",
    marginBottom: "10px",
    marginLeft: "16px",
    marginRight: "16px"
  },
  TaskContent: {
    paddingTop: "10px",
    paddingBottom: "10px",
    display: "grid",
    gridTemplateColumns: "20fr 1fr",
    gridTemplateAreas: '"task trash"'
  },
  TaskText: {
    gridArea: "task",
    cursor: "default",
    
  },
  root: {
    width: 280,
    padding:"16px",
    paddingBottom: "0px",
    marginBottom: "0px"
  },
  DeleteIcon: { gridArea: "trash", color: "#808080", cursor: "pointer" },
  input: {
    color: "white"
  
  }
}));

const marks = [
  {
    value: 5,
    label: '5m',
  },
  {
    value: 20,
    label: '20m',
  },
  {
    value: 60,
    label: '1h',
  },
  {
    value: 120,
    label: '2h',
  },
];



function Showtask(props){
  var kk = props.value;
  const classes = useStyles();
  const mobile = 700;
  const [bg,setBg]=useState(randomColor());
  const [open,setOpen]=useState(false);
  const deletekon = () => {
    postData('https://cloud.pdcommunity.ir/timeblox/delete.php', kk)
            .then(data => {
              window.location.reload();
            console.log(data); // JSON data parsed by data.json() call
            })
  };
  const kkk = toHHMMM(kk.time.start,0)+"-"+toHHMMM(kk.time.start,parseInt(kk.time.duration));
  return(
    <div>
      <Card
        className={classes.Task}
        style={{ backgroundColor: bg }}
      >
        <CardContent className={classes.TaskContent}>
          <MediaQuery minDeviceWidth={mobile}>
            <Typography
              variant="body1"
              color="textSecondary"
              component="p"
              className={classes.TaskText}
            >
              {kkk+" "}
              {kk.text}
              {" for "+kk.time.duration+" minutes"}
              <Typography variant="caption" display="block" gutterBottom>
              {" "+kk.time.recurse}
              </Typography> 
            </Typography>
          </MediaQuery>
          <MediaQuery maxDeviceWidth={mobile - 1}>
            <Typography
              variant="body1"
              color="textSecondary"
              component="p"
              className={classes.TaskText}
            >
            <Typography variant="caption" display="block" gutterBottom>
            {kkk+ " "}
            </Typography>
              {kk.text}
              {" for "+kk.time.duration+" minutes"} 
              <Typography variant="caption" display="block" gutterBottom>
              {" "+kk.time.recurse}
              </Typography> 
            </Typography>
          </MediaQuery>
          <DeleteOutlineIcon
            className={classes.DeleteIcon}
            onClick={deletekon}
          />

        </CardContent>
      </Card>
    </div>
  );
}

function Showselectedtasks(props){
  return( 
  <div>
      {props.value.map((value, index) => {
        return <Showtask value={value}/>
      })}    </div>
  );
}

function Filtertasks(props){
  var tasks = props.value;
  var selected = props.selectedDate;
  var selectedTasks = [];
  var deft = "";
  var dur;
    var i;
    for (i =0 ; i < tasks.length ; i++ ){
      var date = new Date(tasks[i].time.start);
      if ((date.getFullYear() === selected.getFullYear() && date.getMonth() === selected.getMonth() && date.getDate() === selected.getDate()) || (tasks[i].time.recurse === "weekly" && date.getDay() === selected.getDay()) || (tasks[i].time.recurse === "daily")){
        selectedTasks.push(tasks[i]);
        deft = tasks[i].time.start;
        dur = tasks[i].time.duration;
      }}
    selectedTasks.sort((a, b) => ( new Date(a.time.start).getHours()*60+ new Date(a.time.start).getMinutes()) - (new Date(b.time.start).getHours()*60+ new Date(b.time.start).getMinutes()));
    props.deft(toHHMM(deft,dur));
    return(
      <div>
        <Showselectedtasks value={selectedTasks}/>
      </div>
    );
}

function SimpleDialog(props) {
  const { onAdd, onClose, open, deft} = props;
  const classes = useStyles();
  const [values, setValues] = useState({tt:true});
  const [end, setEnd] = useState("30");
  //const [start,setStart] = useState(deft);
  console.log(values);
  console.log(deft);
  const handleClose = () => {
    onClose();
  }
const handleAdd = (event) => {
  //event.preventDefault();
  let kk ={time:{start:values.tt ? deft:values.start, recurse:values.recurse, duration:end},text:values.text};
  setValues({...values,tt:true});
  onAdd(kk);
  onClose();
};
const handlett = () => {
  setValues({...values,tt:false});
};
const handleChange = (event) => {
  //event.persist();
  setValues({ ...values, [event.target.name]: event.target.value });
};
  return (
    <Dialog onClose={handleClose} aria-labelledby="form-dialog-title" open={open} >
      <DialogTitle id="form-dialog-title">Create a new Timeblock</DialogTitle>
      <TextField
        name="start"
        value={values.tt ? deft:values.start}
        onChange={handleChange}
        onClick={handlett}
        required
        id="datetime-local"
        label="Choose start date and time"
        type="datetime-local"
        className={classes.textField}
        InputLabelProps={{
          shrink: true,
        }}
        defaultValue={deft}
      />
      <div className={classes.root}>
      <Typography id="discrete-slider" gutterBottom>
        Duration:
      </Typography>
      <Slider
        name="end"
        onChange={(e, v) => setEnd(v)}
        defaultValue={30}
        step={5}
        marks={marks}
        min={5}
        max={120}
        valueLabelDisplay="auto"
      />
      </div>
      <TextField required id="standard-required" label="Task" className={classes.textField} name="text" value={values.text}
        onChange={handleChange} />
      <FormControl className={classes.formControl} required>
        <InputLabel id="demo-simple-select-label">Recurse</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          name="recurse"
          value={values.recurse}
          onChange={handleChange} 
          defaultValue = ""
        >
          <MenuItem value={"weekly"}>Weekly</MenuItem>
          <MenuItem value={"daily"}>Daily</MenuItem>
          <MenuItem value={"onetime"}>One time</MenuItem>
        </Select>
      </FormControl>
      
      <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button  color="primary" onClick={handleAdd}>
            Add
          </Button>
      </DialogActions>
    </Dialog>
  );}

  async function postData(url = '', data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'no-cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
  
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return "kk"; // parses JSON response into native JavaScript objects
    }
    
    
function App() {
  const [open, setOpen] = React.useState(false);
  const [jj, setJj] = useState([]);
  const classes = useStyles();
  // auto fill next date 👇🏻
  const [deft, setDeft] = useState();

  const [selectedDate, setSelectedDate] = React.useState(new Date());

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios(
        'https://cloud.pdcommunity.ir/timeblox/showjson.php',
      );
      setJj(result.data);
    }
    fetchData();
  }, []);
  const handleDeft = (time) => {
    setDeft(time);
  };
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleAdd = (obj) =>{
    //var url = 'https://cloud.pdcommunity.ir/timeblox/setjson.php?'+ JSON.stringify(obj);
    postData('https://cloud.pdcommunity.ir/timeblox/setjson.php', obj)
    .then(data => {
      setJj([...jj,obj]);
    console.log(data); // JSON data parsed by data.json() call
    });
  }
  return (
    
    <div className="App">
      <addcontext.Provider value={handleAdd}/>
      <header className="App-header">
      <React.Fragment>
        <Typography
          variant="h2"
          color="#0000"
          component="p"
          className={classes.Header}
        >
          TIMEBLOX
        </Typography>
        <Typography
          variant="h5"
          color="#00000"
          component="p"
          className={classes.HeaderSecondry}
        >
          {selectedDay.toLocaleString('fa-IR').split('،‏')[0]+"  "}
{days[selectedDay.getDay()]}
        </Typography>
      </React.Fragment>
      <div id='kk'>
      <MuiPickersUtilsProvider utils={DateFnsUtils} InputProps={{ className: classes.input }}>
      <Grid container justify="space-around">
      <KeyboardDatePicker
          disableToolbar
          variant="inline"
          format="yyyy/MM/dd"
          margin="normal"
          id="date-picker-inline"
          label="Pick a Date to show"
          value={selectedDate}
          onChange={handleDateChange}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
          InputProps={{ className: classes.input }}
        />
        </Grid>
        </MuiPickersUtilsProvider>        
        <SimpleDialog onAdd={handleAdd} open={open} onClose={handleClose} deft={deft}/>
        </div>
      <Filtertasks value={jj} deft={handleDeft} selectedDate={selectedDate}/>
      <Fab color="primary" aria-label="add" onClick={handleClickOpen}>
        <AddIcon/>
        </Fab>
      </header>

    </div>
  );
}

 function toHHMM(deft, dur) {
  var dat = new Date(deft);
  var num = (dat.getHours()*60 + dat.getMinutes()) + parseInt(dur);
  var deftt = deft.split("T");
  var hours   = Math.floor(num / 60);
  var minutes = Math.floor((num - (hours * 60)));
  if (hours   < 10) {hours   = "0"+hours;}
  if (minutes < 10) {minutes = "0"+minutes;}
  return deftt[0]+"T"+hours+':'+minutes;
}
function toHHMMM(deft, dur) {
  var dat = new Date(deft);
  var num = (dat.getHours()*60 + dat.getMinutes()) + parseInt(dur);
  //var deftt = deft.split("T");
  var hours   = Math.floor(num / 60);
  var minutes = Math.floor((num - (hours * 60)));
  if (hours   < 10) {hours   = "0"+hours;}
  if (minutes < 10) {minutes = "0"+minutes;}
  return hours+':'+minutes;
}
export default App;
