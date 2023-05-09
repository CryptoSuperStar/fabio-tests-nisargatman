import React, { useCallback, useEffect, useState } from "react";
import { ListManager } from "react-beautiful-dnd-grid";
import { Card, CardContent, Typography } from "@material-ui/core";

import { makeStyles } from '@material-ui/core/styles';
import ImageWithSpinner from './ImageWithSpinner';

import "./style.css";

const useStyles = makeStyles({
  card: {
    minWidth: 275,
    margin: 10,
    backgroundColor: 'white',
    boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)',
    borderRadius: 5,
    overflow: 'hidden'
  }
});

const App = () =>  {
  const classes = useStyles();

  const [sortedList, setSortedList] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastSaved, setLastSaved] = useState(Date.now());
  const [timer, setTimer] = useState(0);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setTimer((prev) => prev + 1);
  //   }, 5000);

  //   return () => clearInterval(interval);
  // }, []);

  const temp_render = useCallback( async () => {
    console.log("!!")
    if (JSON.stringify(sortedList) !== JSON.stringify(originalData)) {
      saveData();
    }
  }, [timer]);

  useEffect(() => {
    temp_render();
  }, [timer]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.keyCode === 27) {
        setImage(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const getAPI = async () => {
    await fetch('/api/get_document', {
      method: 'GET',
    })
      .then(response => response.json())
      .then(data => {
        setSortedList(data);
        setOriginalData(data);
      })
      .catch((err) => {
        console.error(err, "error after fetch");
      });
  };

  useEffect(() => {
    getAPI();
  }, []);
  
  const sortList = list => setSortedList(list.slice().sort((first, second) => first.position - second.position));

  const handleCardClick = imageUrl => setImage(imageUrl);

  const handleCloseImage = () => setImage(null);

  const timeSinceLastSave = () => {
    // Calculate time since last save
    const diff = new Date() - lastSaved;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    } else {
      return `${seconds} second${seconds !== 1 ? "s" : ""} ago`;
    }
  };

  const saveData = async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/set_document', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sortedList),
      });

      if (response.ok) {
       getAPI();
       setOriginalData(sortedList);
       setLastSaved(new Date());
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  function ListElement(item) {
    item = item.item;

    return (
      <Card className={`card ${classes.card}`} onClick={() => handleCardClick(item.thumbnail)}>
        <CardContent>
          <Typography variant="h5" component="h2">
            {item.title}
          </Typography>
          <ImageWithSpinner src={item.thumbnail} alt={item.thumbnail} ></ImageWithSpinner>
        </CardContent>
      </Card>
    );
  }

  const repositionList = (sourceIndex, destinationIndex) => {
    if (destinationIndex === sourceIndex) {
      return;
    }
    const list = sortedList;

    if (destinationIndex === 0) {
      list[sourceIndex].position = list[0].position - 1;
      sortList(list);
      return;
    }

    if (destinationIndex === list.length - 1) {
      list[sourceIndex].position = list[list.length - 1].position + 1;
      sortList(list);
      return;
    }

    if (destinationIndex < sourceIndex) {
      list[sourceIndex].position =
        (list[destinationIndex].position + list[destinationIndex - 1].position) / 2;
      sortList(list);
      return;
    }

    list[sourceIndex].position =
      (list[destinationIndex].position + list[destinationIndex + 1].position) / 2;
    sortList(list);
  };

  return (
    <div className="App">
      <ListManager
        items={sortedList}
        direction="horizontal"
        maxItems={3}
        render={(item) => <ListElement item={item} />}
        onDragEnd={repositionList}
      />
      {image && (
        <div className="overlay">
          <div className="overlay-inner" onClick={handleCloseImage}>
            <div className="modal">
              <img 
                src={`assets/image/${image}`} 
                alt="overlay" 
                style={{ width: '300px', height: '300px', }} 
              />
            </div>
          </div>
        </div>
      )}
      {loading && <div className="spinner" />}
      <p>Data last saved {timeSinceLastSave()}</p>
    </div>
  );
}

export default App;
