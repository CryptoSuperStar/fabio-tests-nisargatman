import React from 'react'
import { render } from "react-dom";

import App from './App';

// const cors = require("cors");

// Start the mocking conditionally.
const { worker } = require('./mocks/browser');
// worker.use(cors());
worker.start();

render(<App />, document.getElementById("root"));