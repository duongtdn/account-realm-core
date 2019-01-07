"use strict"

import React from 'react'
import { hydrate } from "react-dom"

import Signup from '../templates/components/sign-up-form'

hydrate(<Signup data = {window.DATA} />, document.getElementById("root"))
