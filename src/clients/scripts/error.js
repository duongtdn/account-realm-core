"use strict"

import React from 'react'
import { render } from "react-dom"


import Error from '../templates/components/Error'

render(<Error code = {window.__data.error.code} detail = {window.__data.error.detail} />, document.getElementById("root"))

