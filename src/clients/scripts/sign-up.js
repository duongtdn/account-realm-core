"use strict"

import React from 'react'
import { hydrate } from "react-dom"

import SignUp from '../templates/components/SignUp'

hydrate(<SignUp data = {window.DATA} />, document.getElementById("root"))
